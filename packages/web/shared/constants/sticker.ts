const getSrc = (fileName: string) =>
  `https://fytunrrwifmbhobjfpsp.supabase.co/storage/v1/object/public/effects/${fileName}`;

const initialPositions = [
  { x: 69.07666666666667, y: 2.747848837209302 },
  { x: 7.550256410256411, y: 13.936974789915965 },
  { x: 73.40589743589744, y: 41.050424055512714 },
  { x: 16.602871794871795, y: 65.1516762060507 },
  { x: 16.69453846153846, y: 38.98887043189369 },
  { x: 59.92564102564103, y: 76.45911692559281 },
  { x: 74.56615384615384, y: 54.74840556009812 },
  { x: 5.245948717948718, y: 2.6785036794766968 },
];

export const STICKERS = {
  effect1: {
    data: [
      { src: getSrc("effect1_1.gif"), initialPosition: initialPositions[0] },
      { src: getSrc("effect1_2.gif"), initialPosition: initialPositions[1] },
      { src: getSrc("effect1_3.gif"), initialPosition: initialPositions[2] },
      { src: getSrc("effect1_4.gif"), initialPosition: initialPositions[3] },
      { src: getSrc("effect1_5.gif"), initialPosition: initialPositions[4] },
      { src: getSrc("effect1_6.gif"), initialPosition: initialPositions[5] },
      { src: getSrc("effect1_7.gif"), initialPosition: initialPositions[6] },
      { src: getSrc("effect1_8.gif"), initialPosition: initialPositions[7] },
    ],
  },
  effect2: {
    data: [
      { src: getSrc("effect2_1.gif"), initialPosition: initialPositions[0] },
      { src: getSrc("effect2_2.gif"), initialPosition: initialPositions[1] },
      { src: getSrc("effect2_3.gif"), initialPosition: initialPositions[2] },
      { src: getSrc("effect2_4.gif"), initialPosition: initialPositions[3] },
      { src: getSrc("effect2_5.gif"), initialPosition: initialPositions[4] },
      { src: getSrc("effect2_6.gif"), initialPosition: initialPositions[5] },
      { src: getSrc("effect2_7.gif"), initialPosition: initialPositions[6] },
      { src: getSrc("effect2_8.gif"), initialPosition: initialPositions[7] },
    ],
  },
  effect3: {
    data: [
      { src: getSrc("effect3_1.gif"), initialPosition: initialPositions[0] },
      { src: getSrc("effect3_2.gif"), initialPosition: initialPositions[1] },
      { src: getSrc("effect3_3.gif"), initialPosition: initialPositions[2] },
      { src: getSrc("effect3_4.gif"), initialPosition: initialPositions[3] },
      { src: getSrc("effect3_5.gif"), initialPosition: initialPositions[4] },
      { src: getSrc("effect3_6.gif"), initialPosition: initialPositions[5] },
      { src: getSrc("effect3_7.gif"), initialPosition: initialPositions[6] },
      { src: getSrc("effect3_8.gif"), initialPosition: initialPositions[7] },
    ],
  },
  effect4: {
    data: [
      { src: getSrc("effect4_1.gif"), initialPosition: initialPositions[0] },
      { src: getSrc("effect4_2.gif"), initialPosition: initialPositions[1] },
      { src: getSrc("effect4_3.gif"), initialPosition: initialPositions[2] },
      { src: getSrc("effect4_4.gif"), initialPosition: initialPositions[3] },
      { src: getSrc("effect4_5.gif"), initialPosition: initialPositions[4] },
      { src: getSrc("effect4_6.gif"), initialPosition: initialPositions[5] },
      { src: getSrc("effect4_7.gif"), initialPosition: initialPositions[6] },
      { src: getSrc("effect4_8.gif"), initialPosition: initialPositions[7] },
    ],
  },
} as const;
