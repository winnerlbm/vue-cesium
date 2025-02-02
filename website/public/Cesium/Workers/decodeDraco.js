define([
  './ComponentDatatype-93750d1a',
  './when-4bbc8319',
  './IndexDatatype-b7d979a6',
  './RuntimeError-346a3079',
  './createTaskProcessorWorker',
  './WebGLConstants-1c8239cc'
], function (e, t, r, n, a, o) {
  'use strict'
  var i
  function u(e, t) {
    for (
      var n = e.num_points(), a = e.num_faces(), o = new i.DracoInt32Array(), u = 3 * a, s = r.IndexDatatype.createTypedArray(n, u), d = 0, c = 0;
      c < a;
      ++c
    )
      t.GetFaceFromMesh(e, c, o), (s[d + 0] = o.GetValue(0)), (s[d + 1] = o.GetValue(1)), (s[d + 2] = o.GetValue(2)), (d += 3)
    return i.destroy(o), { typedArray: s, numberOfIndices: u }
  }
  function s(r, n, a) {
    var o,
      u = r.num_points(),
      s = a.num_components(),
      d = new i.AttributeQuantizationTransform()
    if (d.InitFromAttribute(a)) {
      for (var c = new Array(s), f = 0; f < s; ++f) c[f] = d.min_value(f)
      o = { quantizationBits: d.quantization_bits(), minValues: c, range: d.range(), octEncoded: !1 }
    }
    i.destroy(d),
      (d = new i.AttributeOctahedronTransform()).InitFromAttribute(a) && (o = { quantizationBits: d.quantization_bits(), octEncoded: !0 }),
      i.destroy(d)
    var y,
      A = u * s
    y = t.defined(o)
      ? (function (e, t, r, n, a) {
          var o, u
          n.quantizationBits <= 8
            ? ((u = new i.DracoUInt8Array()), (o = new Uint8Array(a)), t.GetAttributeUInt8ForAllPoints(e, r, u))
            : ((u = new i.DracoUInt16Array()), (o = new Uint16Array(a)), t.GetAttributeUInt16ForAllPoints(e, r, u))
          for (var s = 0; s < a; ++s) o[s] = u.GetValue(s)
          return i.destroy(u), o
        })(r, n, a, o, A)
      : (function (e, t, r, n) {
          var a, o
          switch (r.data_type()) {
            case 1:
            case 11:
              ;(o = new i.DracoInt8Array()), (a = new Int8Array(n)), t.GetAttributeInt8ForAllPoints(e, r, o)
              break
            case 2:
              ;(o = new i.DracoUInt8Array()), (a = new Uint8Array(n)), t.GetAttributeUInt8ForAllPoints(e, r, o)
              break
            case 3:
              ;(o = new i.DracoInt16Array()), (a = new Int16Array(n)), t.GetAttributeInt16ForAllPoints(e, r, o)
              break
            case 4:
              ;(o = new i.DracoUInt16Array()), (a = new Uint16Array(n)), t.GetAttributeUInt16ForAllPoints(e, r, o)
              break
            case 5:
            case 7:
              ;(o = new i.DracoInt32Array()), (a = new Int32Array(n)), t.GetAttributeInt32ForAllPoints(e, r, o)
              break
            case 6:
            case 8:
              ;(o = new i.DracoUInt32Array()), (a = new Uint32Array(n)), t.GetAttributeUInt32ForAllPoints(e, r, o)
              break
            case 9:
            case 10:
              ;(o = new i.DracoFloat32Array()), (a = new Float32Array(n)), t.GetAttributeFloatForAllPoints(e, r, o)
          }
          for (var u = 0; u < n; ++u) a[u] = o.GetValue(u)
          return i.destroy(o), a
        })(r, n, a, A)
    var b = e.ComponentDatatype.fromTypedArray(y)
    return {
      array: y,
      data: {
        componentsPerAttribute: s,
        componentDatatype: b,
        byteOffset: a.byte_offset(),
        byteStride: e.ComponentDatatype.getSizeInBytes(b) * s,
        normalized: a.normalized(),
        quantization: o
      }
    }
  }
  function d(e) {
    return t.defined(e.bufferView)
      ? (function (e) {
          var r = new i.Decoder(),
            a = ['POSITION', 'NORMAL'],
            o = e.compressedAttributes
          if ((t.defined(o.COLOR_1) || a.push('COLOR'), t.defined(o.TEXCOORD_1) || a.push('TEX_COORD'), e.dequantizeInShader))
            for (var d = 0; d < a.length; ++d) r.SkipAttributeTransform(i[a[d]])
          var c = e.bufferView,
            f = new i.DecoderBuffer()
          if ((f.Init(e.array, c.byteLength), r.GetEncodedGeometryType(f) !== i.TRIANGULAR_MESH))
            throw new n.RuntimeError('Unsupported draco mesh geometry type.')
          var y = new i.Mesh(),
            A = r.DecodeBufferToMesh(f, y)
          if (!A.ok() || 0 === y.ptr) throw new n.RuntimeError('Error decoding draco mesh geometry: ' + A.error_msg())
          i.destroy(f)
          var b = {}
          for (var l in o)
            if (o.hasOwnProperty(l)) {
              var m,
                w = l
              if (('TEXCOORD_0' === l && (w = 'TEX_COORD'), 'COLOR_0' === l && (w = 'COLOR'), a.includes(w))) {
                var I = r.GetAttributeId(y, i[w])
                m = r.GetAttribute(y, I)
              } else {
                var p = o[l]
                m = r.GetAttributeByUniqueId(y, p)
              }
              b[l] = s(y, r, m)
            }
          var O = { indexArray: u(y, r), attributeData: b }
          return i.destroy(y), i.destroy(r), O
        })(e)
      : (function (e) {
          var t = new i.Decoder()
          e.dequantizeInShader && (t.SkipAttributeTransform(i.POSITION), t.SkipAttributeTransform(i.NORMAL))
          var r = new i.DecoderBuffer()
          if ((r.Init(e.buffer, e.buffer.length), t.GetEncodedGeometryType(r) !== i.POINT_CLOUD))
            throw new n.RuntimeError('Draco geometry type must be POINT_CLOUD.')
          var a = new i.PointCloud(),
            o = t.DecodeBufferToPointCloud(r, a)
          if (!o.ok() || 0 === a.ptr) throw new n.RuntimeError('Error decoding draco point cloud: ' + o.error_msg())
          i.destroy(r)
          var u = {},
            d = e.properties
          for (var c in d)
            if (d.hasOwnProperty(c)) {
              var f
              if ('POSITION' === c || 'NORMAL' === c) {
                var y = t.GetAttributeId(a, i[c])
                f = t.GetAttribute(a, y)
              } else {
                var A = d[c]
                f = t.GetAttributeByUniqueId(a, A)
              }
              u[c] = s(a, t, f)
            }
          return i.destroy(a), i.destroy(t), u
        })(e)
  }
  function c(e) {
    ;(i = e), (self.onmessage = a(d)), self.postMessage(!0)
  }
  return function (e) {
    var r = e.data.webAssemblyConfig
    if (t.defined(r))
      return require([r.modulePath], function (e) {
        t.defined(r.wasmBinaryFile)
          ? (t.defined(e) || (e = self.DracoDecoderModule),
            e(r).then(function (e) {
              c(e)
            }))
          : c(e())
      })
  }
})
