// @ts-nocheck
import getPixels from "get-pixels/dom-pixels";

/**
 * from https://github.com/lokesh/quantize/blob/master/src/quantize.js
 */

const pv = {
  map: function (array, f) {
    const o: any = {};
    return f
      ? array.map(function (d, i) {
          o.index = i;
          return f.call(o, d);
        })
      : array.slice();
  },
  naturalOrder: function (a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
  },
  sum: function (array, f) {
    const o = {};
    return array.reduce(
      f
        ? function (p, d, i) {
            o.index = i;
            return p + f.call(o, d);
          }
        : function (p, d) {
            return p + d;
          },
      0,
    );
  },
  max: function (array, f) {
    return Math.max.apply(null, f ? pv.map(array, f) : array);
  },
};

/**
 * Basic Javascript port of the MMCQ (modified median cut quantization)
 * algorithm from the Leptonica library (http://www.leptonica.com/).
 * Returns a color map you can use to map original pixels to the reduced
 * palette. Still a work in progress.
 *
 * @author Nick Rabinowitz
 * @example

 // array of pixels as [R,G,B] arrays
 var myPixels = [[190,197,190], [202,204,200], [207,214,210], [211,214,211], [205,207,207]
 // etc
 ];
 var maxColors = 4;

 var cmap = MMCQ.quantize(myPixels, maxColors);
 var newPalette = cmap.palette();
 var newPixels = myPixels.map(function(p) {
 return cmap.map(p);
 });

 */
const MMCQ = (function () {
  // private constants
  const sigbits = 5,
    rshift = 8 - sigbits,
    maxIterations = 1000,
    fractByPopulations = 0.75;

  // get reduced-space color index for a pixel

  function getColorIndex(r, g, b) {
    return (r << (2 * sigbits)) + (g << sigbits) + b;
  }

  // Simple priority queue

  function PQueue(comparator) {
    const contents = [];
    let sorted = false;

    function sort() {
      contents.sort(comparator);
      sorted = true;
    }

    return {
      push: function (o) {
        contents.push(o);
        sorted = false;
      },
      peek: function (index) {
        if (!sorted) sort();
        if (index === undefined) index = contents.length - 1;
        return contents[index];
      },
      pop: function () {
        if (!sorted) sort();
        return contents.pop();
      },
      size: function () {
        return contents.length;
      },
      map: function (f) {
        return contents.map(f);
      },
      debug: function () {
        if (!sorted) sort();
        return contents;
      },
    };
  }

  // 3d color space box

  function VBox(r1, r2, g1, g2, b1, b2, histo) {
    const vbox = this;
    vbox.r1 = r1;
    vbox.r2 = r2;
    vbox.g1 = g1;
    vbox.g2 = g2;
    vbox.b1 = b1;
    vbox.b2 = b2;
    vbox.histo = histo;
  }
  VBox.prototype = {
    volume: function (force) {
      const vbox = this;
      if (!vbox._volume || force) {
        vbox._volume =
          (vbox.r2 - vbox.r1 + 1) *
          (vbox.g2 - vbox.g1 + 1) *
          (vbox.b2 - vbox.b1 + 1);
      }
      return vbox._volume;
    },
    count: function (force) {
      const vbox = this,
        histo = vbox.histo;
      if (!vbox._count_set || force) {
        let npix = 0,
          i,
          j,
          k,
          index;
        for (i = vbox.r1; i <= vbox.r2; i++) {
          for (j = vbox.g1; j <= vbox.g2; j++) {
            for (k = vbox.b1; k <= vbox.b2; k++) {
              index = getColorIndex(i, j, k);
              npix += histo[index] || 0;
            }
          }
        }
        vbox._count = npix;
        vbox._count_set = true;
      }
      return vbox._count;
    },
    copy: function () {
      const vbox = this;
      return new VBox(
        vbox.r1,
        vbox.r2,
        vbox.g1,
        vbox.g2,
        vbox.b1,
        vbox.b2,
        vbox.histo,
      );
    },
    avg: function (force) {
      const vbox = this,
        histo = vbox.histo;
      if (!vbox._avg || force) {
        let ntot = 0;
        const mult = 1 << (8 - sigbits);
        let rsum = 0,
          gsum = 0,
          bsum = 0,
          hval,
          i,
          j,
          k,
          histoindex;
        for (i = vbox.r1; i <= vbox.r2; i++) {
          for (j = vbox.g1; j <= vbox.g2; j++) {
            for (k = vbox.b1; k <= vbox.b2; k++) {
              histoindex = getColorIndex(i, j, k);
              hval = histo[histoindex] || 0;
              ntot += hval;
              rsum += hval * (i + 0.5) * mult;
              gsum += hval * (j + 0.5) * mult;
              bsum += hval * (k + 0.5) * mult;
            }
          }
        }
        if (ntot) {
          vbox._avg = [~~(rsum / ntot), ~~(gsum / ntot), ~~(bsum / ntot)];
        } else {
          //console.log('empty box');
          vbox._avg = [
            ~~((mult * (vbox.r1 + vbox.r2 + 1)) / 2),
            ~~((mult * (vbox.g1 + vbox.g2 + 1)) / 2),
            ~~((mult * (vbox.b1 + vbox.b2 + 1)) / 2),
          ];
        }
      }
      return vbox._avg;
    },
    contains: function (pixel) {
      const vbox = this,
        rval = pixel[0] >> rshift;
      gval = pixel[1] >> rshift;
      bval = pixel[2] >> rshift;
      return (
        rval >= vbox.r1 &&
        rval <= vbox.r2 &&
        gval >= vbox.g1 &&
        gval <= vbox.g2 &&
        bval >= vbox.b1 &&
        bval <= vbox.b2
      );
    },
  };

  // Color map

  function CMap() {
    this.vboxes = new PQueue(function (a, b) {
      return pv.naturalOrder(
        a.vbox.count() * a.vbox.volume(),
        b.vbox.count() * b.vbox.volume(),
      );
    });
  }
  CMap.prototype = {
    push: function (vbox) {
      this.vboxes.push({
        vbox: vbox,
        color: vbox.avg(),
      });
    },
    palette: function () {
      return this.vboxes.map(function (vb) {
        return vb.color;
      });
    },
    size: function () {
      return this.vboxes.size();
    },
    map: function (color) {
      const vboxes = this.vboxes;
      for (let i = 0; i < vboxes.size(); i++) {
        if (vboxes.peek(i).vbox.contains(color)) {
          return vboxes.peek(i).color;
        }
      }
      return this.nearest(color);
    },
    nearest: function (color) {
      const vboxes = this.vboxes;
      let d1, d2, pColor;
      for (let i = 0; i < vboxes.size(); i++) {
        d2 = Math.sqrt(
          Math.pow(color[0] - vboxes.peek(i).color[0], 2) +
            Math.pow(color[1] - vboxes.peek(i).color[1], 2) +
            Math.pow(color[2] - vboxes.peek(i).color[2], 2),
        );
        if (d2 < d1 || d1 === undefined) {
          d1 = d2;
          pColor = vboxes.peek(i).color;
        }
      }
      return pColor;
    },
    forcebw: function () {
      // XXX: won't  work yet
      const vboxes = this.vboxes;
      vboxes.sort(function (a, b) {
        return pv.naturalOrder(pv.sum(a.color), pv.sum(b.color));
      });

      // force darkest color to black if everything < 5
      const lowest = vboxes[0].color;
      if (lowest[0] < 5 && lowest[1] < 5 && lowest[2] < 5)
        vboxes[0].color = [0, 0, 0];

      // force lightest color to white if everything > 251
      const idx = vboxes.length - 1,
        highest = vboxes[idx].color;
      if (highest[0] > 251 && highest[1] > 251 && highest[2] > 251)
        vboxes[idx].color = [255, 255, 255];
    },
  };

  // histo (1-d array, giving the number of pixels in
  // each quantized region of color space), or null on error

  function getHisto(pixels) {
    const histosize = 1 << (3 * sigbits),
      histo = new Array(histosize);
    let index, rval, gval, bval;
    pixels.forEach(function (pixel) {
      rval = pixel[0] >> rshift;
      gval = pixel[1] >> rshift;
      bval = pixel[2] >> rshift;
      index = getColorIndex(rval, gval, bval);
      histo[index] = (histo[index] || 0) + 1;
    });
    return histo;
  }

  function vboxFromPixels(pixels, histo) {
    let rmin = 1000000,
      rmax = 0,
      gmin = 1000000,
      gmax = 0,
      bmin = 1000000,
      bmax = 0,
      rval,
      gval,
      bval;
    // find min/max
    pixels.forEach(function (pixel) {
      rval = pixel[0] >> rshift;
      gval = pixel[1] >> rshift;
      bval = pixel[2] >> rshift;
      if (rval < rmin) rmin = rval;
      else if (rval > rmax) rmax = rval;
      if (gval < gmin) gmin = gval;
      else if (gval > gmax) gmax = gval;
      if (bval < bmin) bmin = bval;
      else if (bval > bmax) bmax = bval;
    });
    return new VBox(rmin, rmax, gmin, gmax, bmin, bmax, histo);
  }

  function medianCutApply(histo, vbox) {
    if (!vbox.count()) return;

    const rw = vbox.r2 - vbox.r1 + 1,
      gw = vbox.g2 - vbox.g1 + 1,
      bw = vbox.b2 - vbox.b1 + 1,
      maxw = pv.max([rw, gw, bw]);
    // only one pixel, no split
    if (vbox.count() == 1) {
      return [vbox.copy()];
    }
    /* Find the partial sum arrays along the selected axis. */
    let total = 0;
    const partialsum = [],
      lookaheadsum = [];
    let i, j, k, sum, index;
    if (maxw == rw) {
      for (i = vbox.r1; i <= vbox.r2; i++) {
        sum = 0;
        for (j = vbox.g1; j <= vbox.g2; j++) {
          for (k = vbox.b1; k <= vbox.b2; k++) {
            index = getColorIndex(i, j, k);
            sum += histo[index] || 0;
          }
        }
        total += sum;
        partialsum[i] = total;
      }
    } else if (maxw == gw) {
      for (i = vbox.g1; i <= vbox.g2; i++) {
        sum = 0;
        for (j = vbox.r1; j <= vbox.r2; j++) {
          for (k = vbox.b1; k <= vbox.b2; k++) {
            index = getColorIndex(j, i, k);
            sum += histo[index] || 0;
          }
        }
        total += sum;
        partialsum[i] = total;
      }
    } else {
      /* maxw == bw */
      for (i = vbox.b1; i <= vbox.b2; i++) {
        sum = 0;
        for (j = vbox.r1; j <= vbox.r2; j++) {
          for (k = vbox.g1; k <= vbox.g2; k++) {
            index = getColorIndex(j, k, i);
            sum += histo[index] || 0;
          }
        }
        total += sum;
        partialsum[i] = total;
      }
    }
    partialsum.forEach(function (d, i) {
      lookaheadsum[i] = total - d;
    });

    function doCut(color) {
      const dim1 = color + "1",
        dim2 = color + "2";
      let left,
        right,
        vbox1,
        vbox2,
        d2,
        count2 = 0;
      for (i = vbox[dim1]; i <= vbox[dim2]; i++) {
        if (partialsum[i] > total / 2) {
          vbox1 = vbox.copy();
          vbox2 = vbox.copy();
          left = i - vbox[dim1];
          right = vbox[dim2] - i;
          if (left <= right) d2 = Math.min(vbox[dim2] - 1, ~~(i + right / 2));
          else d2 = Math.max(vbox[dim1], ~~(i - 1 - left / 2));
          // avoid 0-count boxes
          while (!partialsum[d2]) d2++;
          count2 = lookaheadsum[d2];
          while (!count2 && partialsum[d2 - 1]) count2 = lookaheadsum[--d2];
          // set dimensions
          vbox1[dim2] = d2;
          vbox2[dim1] = vbox1[dim2] + 1;
          // console.log('vbox counts:', vbox.count(), vbox1.count(), vbox2.count());
          return [vbox1, vbox2];
        }
      }
    }
    // determine the cut planes
    return maxw == rw ? doCut("r") : maxw == gw ? doCut("g") : doCut("b");
  }

  function quantize(pixels, maxcolors) {
    // short-circuit
    if (!pixels.length || maxcolors < 2 || maxcolors > 256) {
      // console.log('wrong number of maxcolors');
      return false;
    }

    // XXX: check color content and convert to grayscale if insufficient

    const histo = getHisto(pixels),
      histosize = 1 << (3 * sigbits);

    // check that we aren't below maxcolors already
    let nColors = 0;
    histo.forEach(function () {
      nColors++;
    });
    if (nColors <= maxcolors) {
      // XXX: generate the new colors from the histo and return
    }

    // get the beginning vbox from the colors
    let vbox = vboxFromPixels(pixels, histo);
    const pq = new PQueue(function (a, b) {
      return pv.naturalOrder(a.count(), b.count());
    });
    pq.push(vbox);

    // inner function to do the iteration

    function iter(lh, target) {
      let ncolors = lh.size(),
        niters = 0,
        vbox;
      while (niters < maxIterations) {
        if (ncolors >= target) return;
        if (niters++ > maxIterations) {
          // console.log("infinite loop; perhaps too few pixels!");
          return;
        }
        vbox = lh.pop();
        if (!vbox.count()) {
          /* just put it back */
          lh.push(vbox);
          niters++;
          continue;
        }
        // do the cut
        const vboxes = medianCutApply(histo, vbox),
          vbox1 = vboxes[0],
          vbox2 = vboxes[1];

        if (!vbox1) {
          // console.log("vbox1 not defined; shouldn't happen!");
          return;
        }
        lh.push(vbox1);
        if (vbox2) {
          /* vbox2 can be null */
          lh.push(vbox2);
          ncolors++;
        }
      }
    }

    // first set of colors, sorted by population
    iter(pq, fractByPopulations * maxcolors);
    // console.log(pq.size(), pq.debug().length, pq.debug().slice());

    // Re-sort by the product of pixel occupancy times the size in color space.
    const pq2 = new PQueue(function (a, b) {
      return pv.naturalOrder(a.count() * a.volume(), b.count() * b.volume());
    });
    while (pq.size()) {
      pq2.push(pq.pop());
    }

    // next set - generate the median cuts using the (npix * vol) sorting.
    iter(pq2, maxcolors);

    // calculate the actual colors
    const cmap = new CMap();
    while (pq2.size()) {
      cmap.push(pq2.pop());
    }

    return cmap;
  }

  return {
    quantize: quantize,
  };
})();

function createPixelArray(imgData, pixelCount, quality) {
  const pixels = imgData;
  const pixelArray = [];

  for (let i = 0, offset, r, g, b, a; i < pixelCount; i = i + quality) {
    offset = i * 4;
    r = pixels[offset + 0];
    g = pixels[offset + 1];
    b = pixels[offset + 2];
    a = pixels[offset + 3];

    // If pixel is mostly opaque and not white
    if (typeof a === "undefined" || a >= 125) {
      if (!(r > 250 && g > 250 && b > 250)) {
        pixelArray.push([r, g, b]);
      }
    }
  }
  return pixelArray;
}

function validateOptions(options) {
  let { colorCount, quality } = options;

  if (typeof colorCount === "undefined" || !Number.isInteger(colorCount)) {
    colorCount = 10;
  } else if (colorCount === 1) {
    throw new Error(
      "colorCount should be between 2 and 20. To get one color, call getColor() instead of getPalette()",
    );
  } else {
    colorCount = Math.max(colorCount, 2);
    colorCount = Math.min(colorCount, 20);
  }

  if (
    typeof quality === "undefined" ||
    !Number.isInteger(quality) ||
    quality < 1
  ) {
    quality = 10;
  }

  return {
    colorCount,
    quality,
  };
}

function getBase64Image(img) {
  // Create an empty canvas element
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  // Copy the image contents to the canvas
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  // Get the data-URL formatted image
  // Firefox supports PNG and JPEG. You could check img.src to
  // guess the original format, but be aware the using "image/jpg"
  // will re-encode the image.
  const dataURL = canvas.toDataURL("image/png");

  return dataURL;
}

function loadImg(img: HTMLImageElement) {
  return new Promise((resolve, reject) => {
    const dataUrl = getBase64Image(img);
    getPixels(dataUrl, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

export function getColor(img, quality) {
  return new Promise((resolve, reject) => {
    getPalette(img, 5, quality)
      .then((palette) => {
        resolve(palette[0]);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function getPalette(img, colorCount = 10, quality = 10) {
  const options = validateOptions({
    colorCount,
    quality,
  });

  return new Promise((resolve, reject) => {
    loadImg(img)
      .then((imgData) => {
        const pixelCount = imgData.shape[0] * imgData.shape[1];
        const pixelArray = createPixelArray(
          imgData.data,
          pixelCount,
          options.quality,
        );

        const cmap = MMCQ.quantize(pixelArray, options.colorCount);
        const palette = cmap ? cmap.palette() : null;

        resolve(palette);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
