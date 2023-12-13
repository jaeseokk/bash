import { atomWithHash } from "jotai-location";

export const layerAtom = atomWithHash<string | undefined>("layer", undefined, {
  serialize: (value) => (value ? value : ""),
  deserialize: (value) => value,
});
