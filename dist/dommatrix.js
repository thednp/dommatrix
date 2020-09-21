/*!
* DOMMatrix v0.0.4 (https://github.com/thednp/dommatrix)
* Copyright 2020 © thednp
* Licensed under MIT (https://github.com/thednp/DOMMatrix/blob/master/LICENSE)
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.CSSMatrix = factory());
}(this, (function () { 'use strict';

  function Translate(x, y, z){
    var m = new CSSMatrix();
    m.m41 = m.e = x;
    m.m42 = m.f = y;
    m.m43 = z;
    return m
  }
  function Rotate(rx, ry, rz){
    var m = new CSSMatrix();
    rx *= Math.PI / 180;
    ry *= Math.PI / 180;
    rz *= Math.PI / 180;
    var cosx = Math.cos(rx), sinx = -Math.sin(rx),
        cosy = Math.cos(ry), siny = -Math.sin(ry),
        cosz = Math.cos(rz), sinz = -Math.sin(rz);
    m.m11 = m.a = cosy * cosz;
    m.m12 = m.b = -cosy * sinz;
    m.m13 = siny;
    m.m21 = m.c = sinx * siny * cosz + cosx * sinz;
    m.m22 = m.d = cosx * cosz - sinx * siny * sinz;
    m.m23 = -sinx * cosy;
    m.m31 = sinx * sinz - cosx * siny * cosz;
    m.m32 = sinx * cosz + cosx * siny * sinz;
    m.m33 = cosx * cosy;
    return m
  }
  function RotateAxisAngle(x, y, z, angle){
    angle *= Math.PI / 360;
    var sinA = Math.sin(angle),
        cosA = Math.cos(angle),
        sinA2 = sinA * sinA,
        length = Math.sqrt(x * x + y * y + z * z);
    if (length === 0){
      x = 0;
      y = 0;
      z = 1;
    } else {
      x /= length;
      y /= length;
      z /= length;
    }
    var x2 = x * x, y2 = y * y, z2 = z * z;
    var m = new CSSMatrix();
    m.m11 = m.a = 1 - 2 * (y2 + z2) * sinA2;
    m.m12 = m.b = 2 * (x * y * sinA2 + z * sinA * cosA);
    m.m13 = 2 * (x * z * sinA2 - y * sinA * cosA);
    m.m21 = m.c = 2 * (y * x * sinA2 - z * sinA * cosA);
    m.m22 = m.d = 1 - 2 * (z2 + x2) * sinA2;
    m.m23 = 2 * (y * z * sinA2 + x * sinA * cosA);
    m.m31 = 2 * (z * x * sinA2 + y * sinA * cosA);
    m.m32 = 2 * (z * y * sinA2 - x * sinA * cosA);
    m.m33 = 1 - 2 * (x2 + y2) * sinA2;
    m.m14 = m.m24 = m.m34 = 0;
    m.m41 = m.e = m.m42 = m.f = m.m43 = 0;
    m.m44 = 1;
    return m
  }
  function Scale(x, y, z){
    var m = new CSSMatrix();
    m.m11 = m.a = x;
    m.m22 = m.d = y;
    m.m33 = z;
    return m
  }
  function SkewX(angle){
    angle *= Math.PI / 180;
    var m = new CSSMatrix();
    m.m21 = m.c = Math.tan(angle);
    return m
  }
  function SkewY(angle){
    angle *= Math.PI / 180;
    var m = new CSSMatrix();
    m.m12 = m.b = Math.tan(angle);
    return m
  }
  function Multiply(m1, m2){
    var m11 = m2.m11 * m1.m11 + m2.m12 * m1.m21 + m2.m13 * m1.m31 + m2.m14 * m1.m41,
        m12 = m2.m11 * m1.m12 + m2.m12 * m1.m22 + m2.m13 * m1.m32 + m2.m14 * m1.m42,
        m13 = m2.m11 * m1.m13 + m2.m12 * m1.m23 + m2.m13 * m1.m33 + m2.m14 * m1.m43,
        m14 = m2.m11 * m1.m14 + m2.m12 * m1.m24 + m2.m13 * m1.m34 + m2.m14 * m1.m44,
        m21 = m2.m21 * m1.m11 + m2.m22 * m1.m21 + m2.m23 * m1.m31 + m2.m24 * m1.m41,
        m22 = m2.m21 * m1.m12 + m2.m22 * m1.m22 + m2.m23 * m1.m32 + m2.m24 * m1.m42,
        m23 = m2.m21 * m1.m13 + m2.m22 * m1.m23 + m2.m23 * m1.m33 + m2.m24 * m1.m43,
        m24 = m2.m21 * m1.m14 + m2.m22 * m1.m24 + m2.m23 * m1.m34 + m2.m24 * m1.m44,
        m31 = m2.m31 * m1.m11 + m2.m32 * m1.m21 + m2.m33 * m1.m31 + m2.m34 * m1.m41,
        m32 = m2.m31 * m1.m12 + m2.m32 * m1.m22 + m2.m33 * m1.m32 + m2.m34 * m1.m42,
        m33 = m2.m31 * m1.m13 + m2.m32 * m1.m23 + m2.m33 * m1.m33 + m2.m34 * m1.m43,
        m34 = m2.m31 * m1.m14 + m2.m32 * m1.m24 + m2.m33 * m1.m34 + m2.m34 * m1.m44,
        m41 = m2.m41 * m1.m11 + m2.m42 * m1.m21 + m2.m43 * m1.m31 + m2.m44 * m1.m41,
        m42 = m2.m41 * m1.m12 + m2.m42 * m1.m22 + m2.m43 * m1.m32 + m2.m44 * m1.m42,
        m43 = m2.m41 * m1.m13 + m2.m42 * m1.m23 + m2.m43 * m1.m33 + m2.m44 * m1.m43,
        m44 = m2.m41 * m1.m14 + m2.m42 * m1.m24 + m2.m43 * m1.m34 + m2.m44 * m1.m44;
    return new CSSMatrix(
     [m11, m21, m31, m41,
      m12, m22, m32, m42,
      m13, m23, m33, m43,
      m14, m24, m34, m44])
  }
  function fromMatrix(m){
    return new CSSMatrix(
     [m.m11, m.m21, m.m31, m.m41,
      m.m12, m.m22, m.m32, m.m42,
      m.m13, m.m23, m.m33, m.m43,
      m.m14, m.m24, m.m34, m.m44])
  }
  function fromArray(a){
    return feedFromArray(new CSSMatrix(),a)
  }
  function feedFromArray(m,array){
    var a = Array.from(array);
    if (a.length == 16){
      m.m11 = m.a = a[0];
      m.m21 = m.c = a[1];
      m.m31 = a[2];
      m.m41 = m.e = a[3];
      m.m12 = m.b = a[4];
      m.m22 = m.d = a[5];
      m.m32 = a[6];
      m.m42 = m.f = a[7];
      m.m13 = a[8];
      m.m23 = a[9];
      m.m33 = a[10];
      m.m43 = a[11];
      m.m14 = a[12];
      m.m24 = a[13];
      m.m34 = a[14];
      m.m44 = a[15];
    } else if (a.length == 6) {
      m.m11 = m.a = a[0];
      m.m12 = m.b = a[1];
      m.m14 = m.e = a[4];
      m.m21 = m.c = a[2];
      m.m22 = m.d = a[3];
      m.m24 = m.f = a[5];
    } else {
      console.error("CSSMatrix: expecting a 6/16 values Array");
    }
    return m
  }
  var CSSMatrix = function CSSMatrix(){
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];
    this.setIdentity();
    return args && args.length && this.setMatrixValue(args)
  };
  var prototypeAccessors = { isIdentity: { configurable: true },is2D: { configurable: true } };
  CSSMatrix.prototype.setMatrixValue = function setMatrixValue (source){
    var m = this;
    if (!source || !source.length) {
      return m
    } else if (source.length && typeof source[0] === 'string' && source[0].length) {
      var string = String(source[0]).trim(), type = '', values = [];
      if (string == 'none') { return m; }
      type = string.slice(0, string.indexOf('('));
      values = string.slice((type === 'matrix' ? 7 : 9), -1).split(',')
                    .map(function (n){ return Math.abs(n) < 1e-6 ? 0 : +n; });
      if ([6,16].indexOf(values.length)>-1){
        feedFromArray(m,values);
      } else {
        console.error("CSSMatrix: expecting valid CSS matrix() / matrix3d() syntax");
      }
    } else if (source[0] instanceof CSSMatrix) {
      feedFromArray(m,source[0]);
    } else if (Array.isArray(source[0])) {
      feedFromArray(m,source[0]);
    } else if (Array.isArray(source)) {
      feedFromArray(m,source);
    }
    return m
  };
  CSSMatrix.prototype.toString = function toString (){
    var m = this, type = m.is2D ? 'matrix' : 'matrix3d';
    return (type + "(" + (m.toArray(1).join(',')) + ")")
  };
  CSSMatrix.prototype.toArray = function toArray (transposed){
    var m = this;
    return m.is2D ? [ m.a, m.b, m.c, m.d, m.e, m.f ]
      : transposed
      ?[m.m11, m.m12, m.m13, m.m14,
        m.m21, m.m22, m.m23, m.m24,
        m.m31, m.m32, m.m33, m.m34,
        m.m41, m.m42, m.m43, m.m44]
      :[m.m11, m.m21, m.m31, m.m41,
        m.m12, m.m22, m.m32, m.m42,
        m.m13, m.m23, m.m33, m.m43,
        m.m14, m.m24, m.m34, m.m44]
  };
  CSSMatrix.prototype.multiply = function multiply (m2){
    return Multiply(this,m2)
  };
  CSSMatrix.prototype.translate = function translate (x, y, z){
    if (z == null) { z = 0; }
    if (y == null) { y = 0; }
    return Multiply(this,Translate(x, y, z))
  };
  CSSMatrix.prototype.scale = function scale (x, y, z){
    if (y == null) { y = x; }
    if (z == null) { z = x; }
    return Multiply(this,Scale(x, y, z))
  };
  CSSMatrix.prototype.rotate = function rotate (rx, ry, rz){
    if (ry == null) { ry = 0; }
    if (rz == null) {rz = rx; rx = 0;}
    return Multiply(this,Rotate(rx, ry, rz))
  };
  CSSMatrix.prototype.rotateAxisAngle = function rotateAxisAngle (x, y, z, angle){
    if (arguments.length!==4){
      console.error("CSSMatrix: expecting 4 values");
      return this
    }
    return Multiply(this,RotateAxisAngle(x, y, z, angle))
  };
  CSSMatrix.prototype.skewX = function skewX (angle){
    return Multiply(this,SkewX(angle))
  };
  CSSMatrix.prototype.skewY = function skewY (angle){
    return Multiply(this,SkewY(angle))
  };
  CSSMatrix.prototype.setIdentity = function setIdentity (){
    var identity = [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
    return feedFromArray(this,identity)
  };
  prototypeAccessors.isIdentity.get = function (){
    var m = this;
    return (m.m11 == 1 && m.m12 == 0 && m.m13 == 0 && m.m14 == 0 &&
            m.m21 == 0 && m.m22 == 1 && m.m23 == 0 && m.m24 == 0 &&
            m.m31 == 0 && m.m32 == 0 && m.m33 == 1 && m.m34 == 0 &&
            m.m41 == 0 && m.m42 == 0 && m.m43 == 0 && m.m44 == 1)
  };
  prototypeAccessors.isIdentity.set = function (value){
    this.isIdentity = value;
  };
  prototypeAccessors.is2D.get = function (){
    var m = this;
    return (m.m31 == 0 && m.m32 == 0 && m.m33 == 1 && m.m34 == 0 && m.m43 == 0 && m.m44 == 1)
  };
  prototypeAccessors.is2D.set = function (value){
    this.is2D = value;
  };
  CSSMatrix.prototype.transformPoint = function transformPoint (v){
    var _m = this, m = Translate(v.x, v.y, v.z);
    m.m44 = v.w || 1;
    m = _m.multiply(m);
    return {
      x: m.m41,
      y: m.m42,
      z: m.m43,
      w: m.m44
    }
  };
  Object.defineProperties( CSSMatrix.prototype, prototypeAccessors );
  CSSMatrix.Translate = Translate;
  CSSMatrix.Rotate = Rotate;
  CSSMatrix.RotateAxisAngle = RotateAxisAngle;
  CSSMatrix.Scale = Scale;
  CSSMatrix.SkewX = SkewX;
  CSSMatrix.SkewY = SkewY;
  CSSMatrix.Multiply = Multiply;
  CSSMatrix.fromMatrix = fromMatrix;
  CSSMatrix.fromArray = fromArray;
  CSSMatrix.feedFromArray = feedFromArray;

  return CSSMatrix;

})));
