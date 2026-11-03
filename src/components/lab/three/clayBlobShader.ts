// 셰이더로 일렁이는 점토 덩어리의 색과 GLSL 코드입니다.

export type BlobPaletteName = "lilac" | "peach" | "mint" | "sky";

export type BlobPalette = {
  label: string;
  /** 위쪽 밝은 색 */
  light: string;
  /** 가운데 기본 색 */
  base: string;
  /** 아래쪽 진한 색 */
  deep: string;
  /** 가장자리 테두리 빛 */
  rim: string;
};

export const blobPalettes: Record<BlobPaletteName, BlobPalette> = {
  lilac: { label: "라일락", light: "#ece4ff", base: "#b9a3ff", deep: "#7b5be0", rim: "#fff1fa" },
  peach: { label: "복숭아", light: "#ffe9e0", base: "#ffb59c", deep: "#e0785a", rim: "#fff6e8" },
  mint: { label: "민트", light: "#e4fbf1", base: "#8fe3bf", deep: "#4fb78d", rim: "#f4fff2" },
  sky: { label: "하늘", light: "#e6f2ff", base: "#9ccdff", deep: "#5a93d6", rim: "#f6f1ff" },
};

export const blobPaletteNames = Object.keys(blobPalettes) as BlobPaletteName[];

// 3D simplex noise: Stefan Gustavson과 Ashima Arts가 공개한 webgl-noise(MIT)의 계산 방식을 그대로 따랐어요.
const simplexNoise = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

export const clayBlobVertexShader = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform float uHover;
uniform float uPress;
uniform vec3 uPointer;

varying vec3 vNormal;
varying vec3 vViewDir;
varying float vDent;
varying float vHeight;

${simplexNoise}

// 노이즈 입력을 한 번 더 노이즈로 비틀면(domain warp) 둥근 덩어리가 꿀렁이며 흐르는 모양이 됩니다.
float clayField(vec3 n) {
  vec3 q = n * 1.05 + vec3(0.0, uTime * 0.16, uTime * 0.07);
  float warp = snoise(q * 0.6 - uTime * 0.1);
  return snoise(q + warp * 0.6) * 0.85 + snoise(q * 2.0 + warp) * 0.15;
}

// 구의 한 점을 바깥(또는 안쪽)으로 얼마나 밀지 정합니다.
vec3 displace(vec3 p) {
  vec3 n = normalize(p);
  float wobble = clayField(n) * uAmp;
  // 포인터가 있는 쪽일수록 1에 가까워요.
  float facing = smoothstep(0.4, 1.0, dot(n, uPointer));
  // 올리면 그쪽으로 부풀고, 누르면 손가락 자리가 움푹 들어가면서 나머지가 살짝 부풀어요.
  float poke = facing * facing * uPress * 0.5;
  float shape = wobble + facing * uHover * 0.26 - poke + uPress * 0.06;
  return n * (1.0 + shape);
}

void main() {
  vec3 n = normalize(position);
  vec3 p0 = displace(position);

  // 모양이 바뀌면 표면 방향도 바뀌므로, 바로 옆 두 점을 같이 밀어 보고 새 법선을 구합니다.
  vec3 helper = abs(n.y) > 0.99 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
  vec3 tangent = normalize(cross(helper, n));
  vec3 bitangent = cross(n, tangent);
  vec3 p1 = displace(position + tangent * 0.01);
  vec3 p2 = displace(position + bitangent * 0.01);
  vec3 displacedNormal = normalize(cross(p1 - p0, p2 - p0));
  if (dot(displacedNormal, n) < 0.0) {
    displacedNormal = -displacedNormal;
  }

  vec4 worldPosition = modelMatrix * vec4(p0, 1.0);
  vNormal = normalize(mat3(modelMatrix) * displacedNormal);
  vViewDir = normalize(cameraPosition - worldPosition.xyz);
  vDent = clamp((1.0 - length(p0)) * 3.0, 0.0, 1.0);
  vHeight = n.y;
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`;

export const clayBlobFragmentShader = /* glsl */ `
uniform vec3 uLight;
uniform vec3 uBase;
uniform vec3 uDeep;
uniform vec3 uRim;

varying vec3 vNormal;
varying vec3 vViewDir;
varying float vDent;
varying float vHeight;

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vViewDir);

  // 위는 밝게, 아래는 진하게 칠한 파스텔 그라데이션
  float h = vHeight * 0.5 + 0.5;
  vec3 albedo = mix(uDeep, uBase, smoothstep(0.0, 0.55, h));
  albedo = mix(albedo, uLight, smoothstep(0.6, 1.0, h));

  // 빛을 반쯤 감싸게 계산하면(half-lambert) 그림자가 딱 끊기지 않아 무광 점토처럼 보여요.
  vec3 L = normalize(vec3(-0.45, 0.8, 0.6));
  float diffuse = dot(N, L) * 0.5 + 0.5;
  diffuse *= diffuse;
  vec3 color = albedo * (0.55 + 0.6 * diffuse);

  // 움푹 들어간 곳은 살짝 어둡게 해서 눌린 자국이 보이게 합니다.
  color *= 1.0 - vDent * 0.22;

  // 반짝이는 하이라이트 대신 아주 넓고 약한 빛만 얹어요.
  vec3 H = normalize(L + V);
  color += pow(max(dot(N, H), 0.0), 10.0) * 0.05;

  // 비스듬히 보이는 가장자리가 밝아지는 테두리 빛(fresnel)
  float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.5);
  color = mix(color, uRim, fresnel * 0.6);

  gl_FragColor = vec4(color, 1.0);
  #include <colorspace_fragment>
}
`;
