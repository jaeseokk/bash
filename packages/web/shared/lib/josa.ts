function 을를(value: string) {
  return hasJongSung(value) ? "을" : "를";
}
function 은는(value: string) {
  return hasJongSung(value) ? "은" : "는";
}
function 이가(value: string) {
  return hasJongSung(value) ? "이" : "가";
}
function 과와(value: string) {
  return hasJongSung(value) ? "과" : "와";
}
function 으로로(value: string) {
  return hasJongSung(value) ? "으로" : "로";
}

const formatMap = {
  "을/를": 을를,
  을: 을를,
  를: 을를,
  을를: 을를,
  "은/는": 은는,
  은: 은는,
  는: 은는,
  은는: 은는,
  "이/가": 이가,
  이: 이가,
  가: 이가,
  이가: 이가,
  "와/과": 과와,
  와: 과와,
  과: 과와,
  와과: 과와,
  "으로/로": 으로로,
  으로: 으로로,
  로: 으로로,
  으로로: 으로로,
};

const hasJongSung = (value: string) => {
  const lastCode = value.charCodeAt(value.length - 1);
  return (lastCode - 0xac00) % 28 > 0;
};

export const getJosa = (word: string, format: keyof typeof formatMap) => {
  return formatMap[format](word);
};

export const josa = (word: string, format: keyof typeof formatMap) => {
  return `${word}${getJosa(word, format)}`;
};
