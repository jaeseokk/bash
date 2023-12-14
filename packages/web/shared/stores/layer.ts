import { atomWithHash } from "jotai-location";

export const layerAtom = atomWithHash<string | undefined>("layer", undefined, {
  serialize: (value) => (value ? value : ""),
  deserialize: (value) => value,
  setHash: (searchParams) => {
    const value = searchParams.split("=")[1];
    if (value) {
      window.location.hash = searchParams;
    } else {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`,
      );
    }
  },
});
