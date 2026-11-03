/**
 * 3D Coordination Geometry & ChemDraw-style Inking Engine
 * Directly ported from Isomer Sketchbook (https://github.com/voidory/isomers)
 *
 * Implements minimal quaternion & 3D vector math (zero Three.js dependency),
 * polyhedral site geometries (Oh, SP, Td), orthographic projection,
 * ChemDraw wedge/hash inking with halo cutouts, chelate bridges,
 * trackball rotation, and symmetry operations.
 */

export class Vec3 {
  x: number;
  y: number;
  z: number;

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  set(x: number, y: number, z: number): this {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  clone(): Vec3 {
    return new Vec3(this.x, this.y, this.z);
  }

  dot(v: Vec3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  cross(v: Vec3): this {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    return this.set(
      y * v.z - z * v.y,
      z * v.x - x * v.z,
      x * v.y - y * v.x
    );
  }

  normalize(): this {
    const l = Math.hypot(this.x, this.y, this.z) || 1;
    return this.set(this.x / l, this.y / l, this.z / l);
  }

  applyQuaternion(q: Quat): this {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    const qx = q.x;
    const qy = q.y;
    const qz = q.z;
    const qw = q.w;
    const ix = qw * x + qy * z - qz * y;
    const iy = qw * y + qz * x - qx * z;
    const iz = qw * z + qx * y - qy * x;
    const iw = -qx * x - qy * y - qz * z;
    return this.set(
      ix * qw + iw * -qx + iy * -qz - iz * -qy,
      iy * qw + iw * -qy + iz * -qx - ix * -qz,
      iz * qw + iw * -qz + ix * -qy - iy * -qx
    );
  }
}

export class Quat {
  x: number;
  y: number;
  z: number;
  w: number;

  constructor(x = 0, y = 0, z = 0, w = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  set(x: number, y: number, z: number, w: number): this {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }

  clone(): Quat {
    return new Quat(this.x, this.y, this.z, this.w);
  }

  copy(q: Quat): this {
    return this.set(q.x, q.y, q.z, q.w);
  }

  identity(): this {
    return this.set(0, 0, 0, 1);
  }

  dot(q: Quat): number {
    return this.x * q.x + this.y * q.y + this.z * q.z + this.w * q.w;
  }

  invert(): this {
    return this.set(-this.x, -this.y, -this.z, this.w);
  }

  mul(a: Quat, b: Quat): this {
    const ax = a.x, ay = a.y, az = a.z, aw = a.w;
    const bx = b.x, by = b.y, bz = b.z, bw = b.w;
    return this.set(
      ax * bw + aw * bx + ay * bz - az * by,
      ay * bw + aw * by + az * bx - ax * bz,
      az * bw + aw * bz + ax * by - ay * bx,
      aw * bw - ax * bx - ay * by - az * bz
    );
  }

  multiply(q: Quat): this {
    return this.mul(this, q);
  }

  premultiply(q: Quat): this {
    return this.mul(q, this);
  }

  setFromAxisAngle(a: Vec3, ang: number): this {
    const s = Math.sin(ang / 2);
    return this.set(a.x * s, a.y * s, a.z * s, Math.cos(ang / 2));
  }

  setFromMat3(m: number[][]): this {
    const m11 = m[0][0], m12 = m[0][1], m13 = m[0][2];
    const m21 = m[1][0], m22 = m[1][1], m23 = m[1][2];
    const m31 = m[2][0], m32 = m[2][1], m33 = m[2][2];
    const t = m11 + m22 + m33;
    let s: number;
    if (t > 0) {
      s = 0.5 / Math.sqrt(t + 1);
      return this.set((m32 - m23) * s, (m13 - m31) * s, (m21 - m12) * s, 0.25 / s);
    }
    if (m11 > m22 && m11 > m33) {
      s = 2 * Math.sqrt(1 + m11 - m22 - m33);
      return this.set(0.25 * s, (m12 + m21) / s, (m13 + m31) / s, (m32 - m23) / s);
    }
    if (m22 > m33) {
      s = 2 * Math.sqrt(1 + m22 - m11 - m33);
      return this.set((m12 + m21) / s, 0.25 * s, (m23 + m32) / s, (m13 - m31) / s);
    }
    s = 2 * Math.sqrt(1 + m33 - m11 - m22);
    return this.set((m13 + m31) / s, (m23 + m32) / s, 0.25 * s, (m21 - m12) / s);
  }

  slerpQuaternions(a: Quat, b: Quat, t: number): this {
    let bx = b.x, by = b.y, bz = b.z, bw = b.w;
    let c = a.dot(b);
    if (c < 0) {
      c = -c;
      bx = -bx;
      by = -by;
      bz = -bz;
      bw = -bw;
    }
    if (c > 0.9995) {
      this.set(a.x + (bx - a.x) * t, a.y + (by - a.y) * t, a.z + (bz - a.z) * t, a.w + (bw - a.w) * t);
      const l = Math.hypot(this.x, this.y, this.z, this.w);
      return this.set(this.x / l, this.y / l, this.z / l, this.w / l);
    }
    const th = Math.acos(c);
    const sn = Math.sin(th);
    const k0 = Math.sin((1 - t) * th) / sn;
    const k1 = Math.sin(t * th) / sn;
    return this.set(a.x * k0 + bx * k1, a.y * k0 + by * k1, a.z * k0 + bz * k1, a.w * k0 + bw * k1);
  }
}

export const V = {
  add: (a: number[], b: number[]): number[] => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
  sub: (a: number[], b: number[]): number[] => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
  scale: (a: number[], s: number): number[] => [a[0] * s, a[1] * s, a[2] * s],
  dot: (a: number[], b: number[]): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  cross: (a: number[], b: number[]): number[] => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ],
  len: (a: number[]): number => Math.hypot(a[0], a[1], a[2]),
  norm: (a: number[]): number[] => {
    const l = Math.hypot(a[0], a[1], a[2]) || 1;
    return [a[0] / l, a[1] / l, a[2] / l];
  }
};

export const M3 = {
  mulV: (m: number[][], v: number[]): number[] => [0, 1, 2].map(r => m[r][0] * v[0] + m[r][1] * v[1] + m[r][2] * v[2]),
  mul: (a: number[][], b: number[][]): number[][] =>
    [0, 1, 2].map(r => [0, 1, 2].map(c => a[r][0] * b[0][c] + a[r][1] * b[1][c] + a[r][2] * b[2][c])),
  det: (m: number[][]): number =>
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
};

export function mat3FromQuat(q: Quat): number[][] {
  const x = q.x, y = q.y, z = q.z, w = q.w;
  return [
    [1 - 2 * (y * y + z * z), 2 * (x * y - w * z), 2 * (x * z + w * y)],
    [2 * (x * y + w * z), 1 - 2 * (x * x + z * z), 2 * (y * z - w * x)],
    [2 * (x * z - w * y), 2 * (y * z + w * x), 1 - 2 * (x * x + y * y)]
  ];
}

export function quatFromMat3(m: number[][]): Quat {
  return new Quat().setFromMat3(m);
}

export function basisQuat(toward: number[], up: number[]): Quat {
  const z = new Vec3(toward[0], toward[1], toward[2]).normalize();
  const x = new Vec3(up[0], up[1], up[2]).cross(z).normalize();
  const y = z.clone().cross(x);
  return quatFromMat3([
    [x.x, x.y, x.z],
    [y.x, y.y, y.z],
    [z.x, z.y, z.z]
  ]);
}

const SITE_R = 2.3;
const s = SITE_R;

export interface GeometryDef {
  id: 'Td' | 'SP' | 'Oh';
  name: string;
  sym: string;
  sites: number[][];
  unit: number[][];
  order: number[];
  transOf: number[];
  edges: [number, number][];
  sigma: { m: number[][]; perm: number[] };
  baseQ: Quat;
  snaps: Quat[];
  axes: { axis: number[]; order: number }[];
}

// Fixed reflection matrices
const S3 = [[-1, 0, 0], [0, 1, 0], [0, 0, 1]];
const S3Y = [[1, 0, 0], [0, -1, 0], [0, 0, 1]];

export const GEOMS: Record<'Td' | 'SP' | 'Oh', GeometryDef> = (() => {
  // Octahedral
  const ohSites = [
    [s, 0, 0],   // 0: +x right
    [-s, 0, 0],  // 1: -x left
    [0, s, 0],   // 2: +y top
    [0, -s, 0],  // 3: -y bottom
    [0, 0, s],   // 4: +z front
    [0, 0, -s]   // 5: -z back
  ];
  const ohTransOf = [1, 0, 3, 2, 5, 4];
  const ohSigmaM = [[-1, 0, 0], [0, 1, 0], [0, 0, 1]];
  const ohSigmaPerm = [1, 0, 2, 3, 4, 5];
  const ohBaseQ = basisQuat([1, 0.553, 1], [0, 1, 0]);

  // Square Planar
  const spSites = [
    [s, 0, 0],   // 0: right
    [-s, 0, 0],  // 1: left
    [0, s, 0],   // 2: top
    [0, -s, 0]   // 3: bottom
  ];
  const spTransOf = [1, 0, 3, 2];
  const spSigmaM = [[-1, 0, 0], [0, 1, 0], [0, 0, 1]];
  const spSigmaPerm = [1, 0, 2, 3];
  const spBaseQ = basisQuat([0.28, 0.34, 1], [0, 1, 0]);

  // Tetrahedral
  const tdSites = [
    [0, s, 0],                                         // 0: top
    [0, -s / 3, s * 0.9428090416],                     // 1: front-bottom
    [-s * 0.8164965809, -s / 3, -s * 0.4714045208],   // 2: back-left
    [s * 0.8164965809, -s / 3, -s * 0.4714045208]     // 3: back-right
  ];
  const tdTransOf = [-1, -1, -1, -1];
  const tdSigmaM = [[-1, 0, 0], [0, 1, 0], [0, 0, 1]];
  const tdSigmaPerm = [0, 1, 3, 2];
  const tdBaseQ = basisQuat([0.94, 0.279, -0.197], [0, 1, 0]);

  // Helper axes for step rotation
  const ohAxes = [
    { axis: [1, 0, 0], order: 4 },
    { axis: [0, 1, 0], order: 4 },
    { axis: [0, 0, 1], order: 4 },
    { axis: V.norm([1, 1, 1]), order: 3 },
    { axis: V.norm([1, -1, 1]), order: 3 },
    { axis: V.norm([1, 1, -1]), order: 3 },
    { axis: V.norm([-1, 1, 1]), order: 3 },
    { axis: V.norm([1, 1, 0]), order: 2 },
    { axis: V.norm([1, -1, 0]), order: 2 },
    { axis: V.norm([1, 0, 1]), order: 2 },
    { axis: V.norm([1, 0, -1]), order: 2 },
    { axis: V.norm([0, 1, 1]), order: 2 },
    { axis: V.norm([0, 1, -1]), order: 2 }
  ];

  const spAxes = [
    { axis: [0, 0, 1], order: 4 },
    { axis: [1, 0, 0], order: 2 },
    { axis: [0, 1, 0], order: 2 },
    { axis: V.norm([1, 1, 0]), order: 2 },
    { axis: V.norm([1, -1, 0]), order: 2 }
  ];

  const tdAxes = [
    { axis: [0, 1, 0], order: 3 },
    { axis: V.norm([0, -1 / 3, 0.9428]), order: 3 },
    { axis: V.norm([-0.8165, -1 / 3, -0.4714]), order: 3 },
    { axis: V.norm([0.8165, -1 / 3, -0.4714]), order: 3 },
    { axis: [1, 0, 0], order: 2 },
    { axis: [0, 0, 1], order: 2 }
  ];

  const buildSnaps = (baseQ: Quat, axes: { axis: number[]; order: number }[]): Quat[] => {
    const list: Quat[] = [baseQ.clone()];
    for (const ax of axes) {
      for (let step = 1; step < ax.order; step++) {
        const ang = (2 * Math.PI * step) / ax.order;
        const qrot = new Quat().setFromAxisAngle(new Vec3(ax.axis[0], ax.axis[1], ax.axis[2]), ang);
        list.push(baseQ.clone().multiply(qrot));
      }
    }
    return list;
  };

  const ohEdges: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    for (let j = i + 1; j < 6; j++) {
      if (V.dot(V.norm(ohSites[i]), V.norm(ohSites[j])) > -0.5) ohEdges.push([i, j]);
    }
  }

  const spEdges: [number, number][] = [];
  for (let i = 0; i < 4; i++) {
    for (let j = i + 1; j < 4; j++) {
      if (V.dot(V.norm(spSites[i]), V.norm(spSites[j])) > -0.5) spEdges.push([i, j]);
    }
  }

  const tdEdges: [number, number][] = [];
  for (let i = 0; i < 4; i++) {
    for (let j = i + 1; j < 4; j++) {
      tdEdges.push([i, j]);
    }
  }

  return {
    Oh: {
      id: 'Oh',
      name: 'Octahedral',
      sym: 'Oh',
      sites: ohSites,
      unit: ohSites.map(V.norm),
      order: [2, 3, 4, 0, 1, 5],
      transOf: ohTransOf,
      edges: ohEdges,
      sigma: { m: ohSigmaM, perm: ohSigmaPerm },
      baseQ: ohBaseQ,
      snaps: buildSnaps(ohBaseQ, ohAxes),
      axes: ohAxes
    },
    SP: {
      id: 'SP',
      name: 'Square Planar',
      sym: 'D4h',
      sites: spSites,
      unit: spSites.map(V.norm),
      order: [2, 0, 3, 1],
      transOf: spTransOf,
      edges: spEdges,
      sigma: { m: spSigmaM, perm: spSigmaPerm },
      baseQ: spBaseQ,
      snaps: buildSnaps(spBaseQ, spAxes),
      axes: spAxes
    },
    Td: {
      id: 'Td',
      name: 'Tetrahedral',
      sym: 'Td',
      sites: tdSites,
      unit: tdSites.map(V.norm),
      order: [0, 1, 3, 2],
      transOf: tdTransOf,
      edges: tdEdges,
      sigma: { m: tdSigmaM, perm: tdSigmaPerm },
      baseQ: tdBaseQ,
      snaps: buildSnaps(tdBaseQ, tdAxes),
      axes: tdAxes
    }
  };
})();

export function mirrorQ(q: Quat, G: GeometryDef, axis: 'x' | 'y' = 'x'): Quat {
  const S = axis === 'y' ? S3Y : S3;
  const mq = M3.mul(M3.mul(S, mat3FromQuat(q)), G.sigma.m);
  return quatFromMat3(mq);
}

export function nearestSnap(G: GeometryDef, q: Quat): Quat {
  return G.snaps.reduce((best, cur) => (Math.abs(cur.dot(q)) > Math.abs(best.dot(q)) ? cur : best), G.snaps[0]);
}

export function stepRotation(
  G: GeometryDef,
  q: Quat,
  kind: 'v' | 'h' | 'z'
): { targetQ: Quat; order: number; deg: number; axisName: string } {
  const targetVec = { v: [0, 1, 0], h: [1, 0, 0], z: [0, 0, 1] }[kind];
  const t = new Vec3(targetVec[0], targetVec[1], targetVec[2]);
  let best: { a: { axis: number[]; order: number }; d: number } | null = null;

  for (const a of G.axes) {
    const av = new Vec3(a.axis[0], a.axis[1], a.axis[2]).applyQuaternion(q);
    const d = av.dot(t);
    if (!best || Math.abs(d) > Math.abs(best.d) + 1e-5 || (Math.abs(Math.abs(d) - Math.abs(best.d)) < 1e-5 && a.order > best.a.order)) {
      best = { a, d };
    }
  }

  const bestAxis = best ? best.a : G.axes[0];
  const bestDot = best ? best.d : 1;
  const ax = V.scale(bestAxis.axis, bestDot < 0 ? -1 : 1);
  const ang = (2 * Math.PI) / bestAxis.order;
  const dq = new Quat().setFromAxisAngle(new Vec3(ax[0], ax[1], ax[2]).normalize(), ang);
  const axisName = kind === 'v' ? 'vertical axis' : kind === 'h' ? 'horizontal axis' : 'page axis';

  return {
    targetQ: q.clone().multiply(dq),
    order: bestAxis.order,
    deg: Math.round(360 / bestAxis.order),
    axisName
  };
}

export interface RenderMoleculeOptions {
  cx: number;
  cy: number;
  L: number;
  flip?: boolean;
  colorLabels?: boolean;
  key?: number;
}

export interface MoleculeViewStyleState {
  styles: Record<string, 'plain' | 'wedge' | 'hash'>;
}

const T_IN = 0.45;
const T_OUT = 0.38;

const LIGAND_COLORS: Record<string, string> = {
  A: '#c8322a', // Crimson
  B: '#1b62b0', // Royal Blue
  C: '#9a6b00', // Gold/Amber
  D: '#2a7a35', // Forest Green
  E: '#6b3fb5', // Purple
  F: '#c25d0e', // Tangerine
  Cl: '#16a34a', // Green
  NH3: '#0284c7', // Sky Blue
  NO2: '#d97706', // Amber
  SCN: '#9333ea', // Violet
  en: '#4f46e5', // Indigo
  gly: '#e11d48' // Rose
};

/**
 * Draws the 3D coordination complex in ChemDraw-style projection.
 */
export function drawMoleculeChemDraw(
  ctx: CanvasRenderingContext2D,
  geom: 'Td' | 'SP' | 'Oh',
  cfg: { labels: string[]; edges?: [number, number][]; centralAtom?: string },
  q: Quat,
  styleState: MoleculeViewStyleState,
  opts: RenderMoleculeOptions
): void {
  const G = GEOMS[geom];
  const cx = opts.cx;
  const cy = opts.cy;
  const L = opts.L;
  const flip = !!opts.flip;
  const colorLabels = opts.colorLabels ?? true;
  const key = opts.key ?? 0;

  const fs = Math.max(10, L * 0.25);
  const lw = Math.max(1.2, L * 0.025);
  const clrL = fs * 0.58;
  const clrM = fs * 0.62;

  const _v = new Vec3();
  const proj = (v: number[]) => {
    _v.set(v[0], v[1], v[2]).applyQuaternion(q);
    return {
      x: cx + (flip ? -_v.x : _v.x) * L,
      y: cy - _v.y * L,
      z: _v.z
    };
  };

  const P = G.unit.map(proj);
  interface Item {
    kind: 'bond' | 'bridge' | 'label';
    i: number;
    st?: 'plain' | 'wedge' | 'hash';
    pts?: { x: number; y: number; z: number }[];
    a?: number;
    b?: number;
    depth: number;
  }

  const items: Item[] = [];

  // Categorize bonds into wedge/hash/plain based on depth with hysteresis
  P.forEach((p, i) => {
    const sk = `${key}:${i}`;
    let st: 'plain' | 'wedge' | 'hash' = styleState.styles[sk] || 'plain';
    const z = p.z;
    if (st === 'plain') {
      if (z > T_IN) st = 'wedge';
      else if (z < -T_IN) st = 'hash';
    } else if (st === 'wedge') {
      if (z < T_OUT) st = z < -T_IN ? 'hash' : 'plain';
    } else if (z > -T_OUT) {
      st = z > T_IN ? 'wedge' : 'plain';
    }
    styleState.styles[sk] = st;

    items.push({ kind: 'bond', i, st, depth: z / 2 });
    items.push({ kind: 'label', i, depth: z });
  });

  // Central metal atom label
  items.push({ kind: 'label', i: -1, depth: 0 });

  // Chelate bridges
  if (cfg.edges) {
    cfg.edges.forEach(([a, b]) => {
      const pa = G.unit[a];
      const pb = G.unit[b];
      const n = V.norm(V.add(pa, pb));
      const e = V.sub(pb, pa);
      const c1 = V.add(V.add(pa, V.scale(n, 0.42)), V.scale(e, 0.14));
      const c2 = V.sub(V.add(pb, V.scale(n, 0.42)), V.scale(e, 0.14));
      const pts = [P[a], proj(c1), proj(c2), P[b]];
      items.push({
        kind: 'bridge',
        i: 0,
        a,
        b,
        pts,
        depth: (pts[1].z + pts[2].z) / 2
      });
    });
  }

  // Sort items: lines back-to-front, then all labels on top
  items.sort((u, v) => (u.kind === 'label' ? 1 : 0) - (v.kind === 'label' ? 1 : 0) || u.depth - v.depth);

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const inked = (drawFn: (halo: boolean) => void, col = '#1f1d1a') => {
    // 1. White knockout halo
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.fillStyle = '#ffffff';
    ctx.lineWidth = lw * 3.8;
    drawFn(true);
    ctx.restore();

    // 2. Foreground stroke/fill
    ctx.strokeStyle = col;
    ctx.fillStyle = col;
    ctx.lineWidth = lw;
    drawFn(false);
  };

  for (const it of items) {
    if (it.kind === 'bond') {
      const p = P[it.i];
      const dx = p.x - cx;
      const dy = p.y - cy;
      const len = Math.hypot(dx, dy);
      if (len < clrM + clrL + lw * 2) continue; // pointing almost straight at camera
      const ux = dx / len;
      const uy = dy / len;
      const nx = -uy;
      const ny = ux;
      const s0 = [cx + ux * clrM, cy + uy * clrM];
      const s1 = [p.x - ux * clrL, p.y - uy * clrL];

      if (it.st === 'plain') {
        inked(() => {
          ctx.beginPath();
          ctx.moveTo(s0[0], s0[1]);
          ctx.lineTo(s1[0], s1[1]);
          ctx.stroke();
        }, '#334155');
      } else if (it.st === 'wedge') {
        const w = L * 0.075;
        const t0 = lw * 0.35;
        inked(halo => {
          ctx.beginPath();
          ctx.moveTo(s0[0] + nx * t0, s0[1] + ny * t0);
          ctx.lineTo(s1[0] + nx * w, s1[1] + ny * w);
          ctx.lineTo(s1[0] - nx * w, s1[1] - ny * w);
          ctx.lineTo(s0[0] - nx * t0, s0[1] - ny * t0);
          ctx.closePath();
          if (halo) ctx.stroke();
          else ctx.fill();
        }, '#0284c7');
      } else {
        // Hash bond
        const numDashes = Math.max(4, Math.round(len / (lw * 3.2)));
        const sl = Math.hypot(s1[0] - s0[0], s1[1] - s0[1]);
        inked(() => {
          ctx.beginPath();
          for (let k = 0; k < numDashes; k++) {
            const t = (k + 0.6) / numDashes;
            const pt = [s0[0] + ux * sl * t, s0[1] + uy * sl * t];
            const hw = L * (0.014 + 0.065 * t);
            ctx.moveTo(pt[0] - nx * hw, pt[1] - ny * hw);
            ctx.lineTo(pt[0] + nx * hw, pt[1] + ny * hw);
          }
          ctx.stroke();
        }, '#64748b');
      }
    } else if (it.kind === 'bridge' && it.pts) {
      const p = it.pts.map(o => [o.x, o.y]);
      const cut = (a: number[], b: number[]) => {
        const dd = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
        const k = Math.min(clrL, dd * 0.8);
        return [a[0] + ((b[0] - a[0]) / dd) * k, a[1] + ((b[1] - a[1]) / dd) * k];
      };
      const path = [cut(p[0], p[1]), p[1], p[2], cut(p[3], p[2])];
      inked(() => {
        ctx.beginPath();
        ctx.moveTo(path[0][0], path[0][1]);
        path.slice(1).forEach(pt => ctx.lineTo(pt[0], pt[1]));
        ctx.stroke();
      }, '#6366f1'); // Chelate ring backbone
    } else {
      // Label
      const isM = it.i < 0;
      const x = isM ? cx : P[it.i].x;
      const y = isM ? cy : P[it.i].y;
      const X = isM ? cfg.centralAtom || 'M' : cfg.labels[it.i] || '?';

      // Circular knock-out
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x, y, fs * 0.6, 0, Math.PI * 2);
      ctx.fill();

      // Border ring
      const atomColor = isM
        ? '#0369a1'
        : colorLabels && LIGAND_COLORS[X]
          ? LIGAND_COLORS[X]
          : '#475569';
      ctx.strokeStyle = atomColor;
      ctx.lineWidth = isM ? lw * 1.6 : lw * 1.2;
      ctx.beginPath();
      ctx.arc(x, y, fs * 0.55, 0, Math.PI * 2);
      ctx.stroke();

      // Label Text
      ctx.fillStyle = atomColor;
      ctx.font = `bold ${Math.round(fs * (X.length > 2 ? 0.72 : 0.88))}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(X, x, y + fs * 0.04);
    }
  }
}
