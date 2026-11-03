// Done Buddy Lottie 애니메이션(public/lab/lottie/done-buddy.json)을 만듭니다.
// After Effects 없이 키프레임을 직접 적어서 만들기 때문에, 고칠 때는 이 파일을 바꾸고 다시 실행하면 됩니다.
//   node scripts/make-done-buddy-lottie.mjs
//
// 0~120 프레임: 통통 튀는 기본 반복 (2초, 60fps)
// 120~180 프레임: 누르면 보여 주는 높은 점프 (마커 "jump")

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const FPS = 60;
const LOOP_END = 120;
const JUMP_END = 180;
const SIZE = 400;
const GROUND_Y = 352;

// 사이트의 점토 색과 맞춥니다. (globals.css, not-found 페이지의 Done Buddy)
const color = {
  tone: hex("#b9a3ff"),
  toneDark: hex("#7b5be0"),
  toneLight: hex("#e7dfff"),
  ink: hex("#2d2545"),
  cheek: hex("#ffb3cf"),
  white: hex("#ffffff"),
  shadow: hex("#6b4fd6"),
};

// cubic-bezier 값입니다. CSS의 transition-timing-function과 같은 뜻입니다.
const ease = {
  inOut: [0.45, 0, 0.55, 1],
  out: [0.22, 1, 0.36, 1],
  in: [0.55, 0, 0.78, 0.4],
  linear: [0, 0, 1, 1],
};

function hex(value) {
  const n = Number.parseInt(value.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => Math.round((c / 255) * 1000) / 1000);
}

function toArray(value) {
  return Array.isArray(value) ? value : [value];
}

function fixed(value) {
  return { a: 0, k: value };
}

// [프레임, 값, 이징] 목록을 Lottie 키프레임으로 바꿉니다. 이징은 다음 키프레임까지 가는 동안에 쓰입니다.
function keys(list) {
  return {
    a: 1,
    k: list.map(([t, value, curve = ease.inOut, hold = false], index) => {
      const s = toArray(value);
      if (index === list.length - 1) {
        return { t, s };
      }
      if (hold) {
        return { t, s, h: 1 };
      }
      const dims = s.length;
      return {
        t,
        s,
        o: { x: Array(dims).fill(curve[0]), y: Array(dims).fill(curve[1]) },
        i: { x: Array(dims).fill(curve[2]), y: Array(dims).fill(curve[3]) },
      };
    }),
  };
}

function groupTransform({ position = [0, 0], anchor = [0, 0], scale = fixed([100, 100]), rotation = fixed(0), opacity = fixed(100) } = {}) {
  return {
    ty: "tr",
    p: fixed(position),
    a: fixed(anchor),
    s: scale,
    r: rotation,
    o: opacity,
    sk: fixed(0),
    sa: fixed(0),
    nm: "Transform",
  };
}

function group(name, items, transform) {
  return { ty: "gr", nm: name, it: [...items, groupTransform(transform)] };
}

function ellipse(name, [x, y], [w, h]) {
  return { ty: "el", nm: name, d: 1, p: fixed([x, y]), s: fixed([w, h]) };
}

function path(name, { closed, vertices, inTangents, outTangents }) {
  return {
    ty: "sh",
    nm: name,
    d: 1,
    ks: fixed({ c: closed, v: vertices, i: inTangents, o: outTangents }),
  };
}

function fill(rgb, opacity = 100) {
  return { ty: "fl", nm: "Fill", c: fixed([...rgb, 1]), o: fixed(opacity), r: 1, bm: 0 };
}

function stroke(rgb, width) {
  return { ty: "st", nm: "Stroke", c: fixed([...rgb, 1]), o: fixed(100), w: fixed(width), lc: 2, lj: 2, ml: 4, bm: 0 };
}

// 왼쪽 위에서 빛을 받은 점토처럼 보이게 방사형 그라디언트로 칠합니다. (.clay-ball과 같은 배색)
function radialFill(center, edge) {
  const stops = [
    [0, color.toneLight],
    [0.45, color.tone],
    [1, color.toneDark],
  ];
  return {
    ty: "gf",
    nm: "Clay gradient",
    o: fixed(100),
    r: 1,
    bm: 0,
    g: { p: stops.length, k: fixed(stops.flatMap(([offset, rgb]) => [offset, ...rgb])) },
    s: fixed(center),
    e: fixed(edge),
    t: 2,
    h: fixed(0),
    a: fixed(0),
  };
}

// 몸통은 완전한 타원이 아니라 살짝 찌그러진 점토 덩어리입니다. 바닥 쪽을 조금 납작하게 했습니다.
const bodyPath = path("Blob", {
  closed: true,
  vertices: [
    [4, -198],
    [112, -98],
    [0, 0],
    [-110, -96],
  ],
  inTangents: [
    [-60, 0],
    [0, -56],
    [68, 0],
    [0, 56],
  ],
  outTangents: [
    [62, 0],
    [0, 54],
    [-66, 0],
    [0, -56],
  ],
});

// 눈 깜빡임과 점프할 때의 웃는 눈(^ ^)은 hold 키프레임으로 바꿔 끼웁니다.
const eyeBlink = keys([
  [0, [100, 100]],
  [96, [100, 100], ease.in],
  [100, [100, 8], ease.out],
  [105, [100, 100]],
]);

const dotEyesOpacity = keys([
  [0, 100, ease.linear, true],
  [130, 0, ease.linear, true],
  [168, 100],
]);

const happyEyesOpacity = keys([
  [0, 0, ease.linear, true],
  [130, 100, ease.linear, true],
  [168, 0],
]);

function happyEye(x) {
  return path("Happy eye", {
    closed: false,
    vertices: [
      [x - 10, -106],
      [x + 10, -106],
    ],
    inTangents: [
      [0, 0],
      [-2, -14],
    ],
    outTangents: [
      [2, -14],
      [0, 0],
    ],
  });
}

const face = group("Face", [
  group(
    "Eyes",
    [ellipse("Left eye", [-34, -112], [18, 18]), ellipse("Right eye", [34, -112], [18, 18]), fill(color.ink)],
    { position: [0, -112], anchor: [0, -112], scale: eyeBlink, opacity: dotEyesOpacity },
  ),
  group("Happy eyes", [happyEye(-34), happyEye(34), stroke(color.ink, 6)], { opacity: happyEyesOpacity }),
  group(
    "Mouth",
    [
      path("Smile", {
        closed: false,
        vertices: [
          [-15, -86],
          [15, -86],
        ],
        inTangents: [
          [0, 0],
          [-5, 14],
        ],
        outTangents: [
          [5, 14],
          [0, 0],
        ],
      }),
      stroke(color.ink, 6),
    ],
    {
      position: [0, -80],
      anchor: [0, -80],
      scale: keys([
        [0, [100, 100], ease.linear, true],
        [128, [100, 100], ease.out],
        [136, [135, 135]],
        [164, [135, 135], ease.inOut],
        [172, [100, 100]],
      ]),
    },
  ),
  group("Cheeks", [ellipse("Left cheek", [-62, -88], [24, 14]), ellipse("Right cheek", [62, -88], [24, 14]), fill(color.cheek, 85)]),
]);

const highlight = group("Highlight", [ellipse("Shine", [0, 0], [54, 30]), fill(color.white, 45)], {
  position: [-46, -152],
  rotation: fixed(-32),
});

const body = group("Body", [bodyPath, radialFill([-38, -142], [100, -6])]);

// 몸 전체가 바닥(발끝)을 기준으로 늘어나고 찌그러지도록 앵커를 바닥 가운데에 둡니다.
const buddyLayer = {
  ddd: 0,
  ind: 1,
  ty: 4,
  nm: "Buddy",
  sr: 1,
  ks: {
    o: fixed(100),
    r: keys([
      [0, 0, ease.linear, true],
      [128, 0, ease.inOut],
      [140, -10, ease.inOut],
      [154, 10, ease.inOut],
      [166, 0],
    ]),
    p: keys([
      [0, [SIZE / 2, GROUND_Y, 0], ease.linear],
      [12, [SIZE / 2, GROUND_Y, 0], ease.out],
      [42, [SIZE / 2, GROUND_Y - 105, 0], ease.in],
      [66, [SIZE / 2, GROUND_Y, 0], ease.linear, true],
      [128, [SIZE / 2, GROUND_Y, 0], ease.out],
      [150, [SIZE / 2, GROUND_Y - 136, 0], ease.in],
      [170, [SIZE / 2, GROUND_Y, 0]],
    ]),
    a: fixed([0, 0, 0]),
    s: keys([
      [0, [100, 100, 100]],
      [12, [114, 86, 100], ease.out],
      [20, [92, 110, 100], ease.out],
      [42, [100, 100, 100], ease.in],
      [62, [94, 107, 100], ease.linear],
      [66, [122, 80, 100], ease.out],
      [74, [93, 108, 100]],
      [84, [105, 96, 100]],
      [94, [100, 100, 100]],
      [108, [102, 98, 100]],
      [120, [100, 100, 100]],
      [128, [118, 82, 100], ease.out],
      [134, [88, 114, 100], ease.out],
      [150, [100, 100, 100], ease.in],
      [166, [92, 109, 100], ease.linear],
      [170, [124, 78, 100], ease.out],
      [175, [95, 105, 100]],
      [180, [100, 100, 100]],
    ]),
  },
  ao: 0,
  shapes: [face, highlight, body],
  ip: 0,
  op: JUMP_END,
  st: 0,
  bm: 0,
};

// 바닥 그림자는 몸이 높이 뜰수록 작고 옅어집니다.
const shadowLayer = {
  ddd: 0,
  ind: 2,
  ty: 4,
  nm: "Shadow",
  sr: 1,
  ks: {
    o: keys([
      [0, 24],
      [12, 26, ease.out],
      [42, 10, ease.in],
      [66, 28],
      [84, 24, ease.linear, true],
      [128, 26, ease.out],
      [150, 6, ease.in],
      [170, 30],
      [180, 24],
    ]),
    r: fixed(0),
    p: fixed([SIZE / 2, GROUND_Y + 6, 0]),
    a: fixed([0, 0, 0]),
    s: keys([
      [0, [100, 100, 100]],
      [12, [110, 100, 100], ease.out],
      [42, [58, 58, 100], ease.in],
      [66, [120, 100, 100]],
      [84, [100, 100, 100], ease.linear, true],
      [128, [112, 100, 100], ease.out],
      [150, [46, 46, 100], ease.in],
      [170, [124, 100, 100]],
      [180, [100, 100, 100]],
    ]),
  },
  ao: 0,
  shapes: [group("Shadow", [ellipse("Shadow", [0, 0], [170, 24]), fill(color.shadow)])],
  ip: 0,
  op: JUMP_END,
  st: 0,
  bm: 0,
};

const animation = {
  v: "5.12.2",
  fr: FPS,
  ip: 0,
  op: JUMP_END,
  w: SIZE,
  h: SIZE,
  nm: "Done Buddy",
  ddd: 0,
  assets: [],
  // 앞에 있는 레이어가 위에 그려집니다.
  layers: [buddyLayer, shadowLayer],
  markers: [
    { tm: 0, cm: "bounce", dr: LOOP_END },
    { tm: LOOP_END, cm: "jump", dr: JUMP_END - LOOP_END },
  ],
};

const output = join(dirname(fileURLToPath(import.meta.url)), "../public/lab/lottie/done-buddy.json");
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${JSON.stringify(animation)}\n`);
console.log(`Done Buddy Lottie를 만들었어요: ${output}`);
