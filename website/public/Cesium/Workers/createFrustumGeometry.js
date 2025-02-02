define([
  './when-4bbc8319',
  './FrustumGeometry-eb154eb0',
  './Transforms-d13cc04e',
  './Matrix2-9aa31791',
  './RuntimeError-346a3079',
  './ComponentDatatype-93750d1a',
  './WebGLConstants-1c8239cc',
  './combine-83860057',
  './GeometryAttribute-43536dc0',
  './GeometryAttributes-7827a6c2',
  './Plane-318d6937',
  './VertexFormat-71718faa'
], function (e, t, r, n, a, o, u, c, m, i, s, b) {
  'use strict'
  return function (r, n) {
    return e.defined(n) && (r = t.FrustumGeometry.unpack(r, n)), t.FrustumGeometry.createGeometry(r)
  }
})
