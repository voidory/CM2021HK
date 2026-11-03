import test from 'node:test';
import assert from 'node:assert/strict';
import {
  Vec3,
  Quat,
  GEOMS,
  stepRotation,
  nearestSnap,
  basisQuat
} from './isomer3dEngine';

test('Vec3 vector operations compute correct dot, cross, and quaternion rotation', () => {
  const v1 = new Vec3(1, 0, 0);
  const v2 = new Vec3(0, 1, 0);
  const cross = v1.clone().cross(v2);
  assert.equal(cross.x, 0);
  assert.equal(cross.y, 0);
  assert.equal(cross.z, 1);

  const q = new Quat().setFromAxisAngle(new Vec3(0, 0, 1), Math.PI / 2);
  const rot = v1.clone().applyQuaternion(q);
  assert.ok(Math.abs(rot.x) < 1e-6);
  assert.ok(Math.abs(rot.y - 1) < 1e-6);
});

test('GEOMS defines Oh, SP, and Td geometries with correct site counts and axes', () => {
  assert.equal(GEOMS.Oh.sites.length, 6);
  assert.equal(GEOMS.SP.sites.length, 4);
  assert.equal(GEOMS.Td.sites.length, 4);

  assert.ok(GEOMS.Oh.axes.length >= 3);
  assert.ok(GEOMS.SP.axes.length >= 2);
  assert.ok(GEOMS.Td.axes.length >= 2);
});

test('stepRotation executes valid symmetry rotations on octahedral base view', () => {
  const qBase = GEOMS.Oh.baseQ.clone();
  const vRot = stepRotation(GEOMS.Oh, qBase, 'v');
  assert.ok(vRot.order >= 2);
  assert.ok(vRot.deg > 0);
  assert.ok(vRot.targetQ.dot(qBase) < 0.9999);

  const hRot = stepRotation(GEOMS.Oh, qBase, 'h');
  assert.ok(hRot.order >= 2);
  assert.ok(hRot.deg > 0);
});

test('nearestSnap identifies valid textbook view', () => {
  const qBase = GEOMS.Oh.baseQ.clone();
  const snapped = nearestSnap(GEOMS.Oh, qBase);
  assert.ok(Math.abs(Math.abs(snapped.dot(qBase)) - 1) < 1e-4);
});
