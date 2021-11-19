/*!
* DOMMatrix v0.0.10 (https://thednp.github.io/DOMMatrix/)
* Copyright 2021 © thednp
* Licensed under MIT (https://github.com/thednp/DOMMatrix/blob/master/LICENSE)
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.CSSMatrix = factory());
})(this, (function () { 'use strict';

  // DOMMatrix Static methods
  // * `fromFloat64Array` and `fromFloat32Array` methods are not supported;
  // * `fromArray` a more simple implementation, should also accept float[32/64]Array;
  // * `fromMatrix` load values from another CSSMatrix/DOMMatrix instance;
  // * `fromString` parses and loads values from any valid CSS transform string.

  /**
   * Creates a new mutable `CSSMatrix` object given an array float values.
   *
   * If the array has six values, the result is a 2D matrix; if the array has 16 values,
   * the result is a 3D matrix. Otherwise, a TypeError exception is thrown.
   *
   * @param {Number[]} array an `Array` to feed values from.
   * @return {CSSMatrix} the resulted matrix.
   */
  function fromArray(array) {
    var m = new CSSMatrix();
    var a = Array.from(array);

    if (a.length === 16) {
      var m11 = a[0];
      var m12 = a[1];
      var m13 = a[2];
      var m14 = a[3];
      var m21 = a[4];
      var m22 = a[5];
      var m23 = a[6];
      var m24 = a[7];
      var m31 = a[8];
      var m32 = a[9];
      var m33 = a[10];
      var m34 = a[11];
      var m41 = a[12];
      var m42 = a[13];
      var m43 = a[14];
      var m44 = a[15];

      m.m11 = m11;
      m.a = m11;

      m.m21 = m21;
      m.c = m21;

      m.m31 = m31;

      m.m41 = m41;
      m.e = m41;

      m.m12 = m12;
      m.b = m12;

      m.m22 = m22;
      m.d = m22;

      m.m32 = m32;

      m.m42 = m42;
      m.f = m42;

      m.m13 = m13;
      m.m23 = m23;
      m.m33 = m33;
      m.m43 = m43;
      m.m14 = m14;
      m.m24 = m24;
      m.m34 = m34;
      m.m44 = m44;
    } else if (a.length === 6) {
      var m11$1 = a[0];
      var m12$1 = a[1];
      var m21$1 = a[2];
      var m22$1 = a[3];
      var m41$1 = a[4];
      var m42$1 = a[5];
      m.m11 = m11$1;
      m.a = m11$1;

      m.m12 = m12$1;
      m.b = m12$1;

      m.m21 = m21$1;
      m.c = m21$1;

      m.m22 = m22$1;
      m.d = m22$1;

      m.m41 = m41$1;
      m.e = m41$1;

      m.m42 = m42$1;
      m.f = m42$1;
    } else {
      throw new TypeError('CSSMatrix: expecting a 6/16 values Array');
    }
    return m;
  }

  /**
   * Creates a new mutable `CSSMatrix` object given an existing matrix or a
   * `DOMMatrix` *Object* which provides the values for its properties.
   *
   * @param {CSSMatrix | DOMMatrix} m the source matrix to feed values from.
   * @return {CSSMatrix} the resulted matrix.
   */
  function fromMatrix(m) {
    return fromArray(
      [m.m11, m.m12, m.m13, m.m14,
        m.m21, m.m22, m.m23, m.m24,
        m.m31, m.m32, m.m33, m.m34,
        m.m41, m.m42, m.m43, m.m44]
    );
  }

  /**
   * Feed a CSSMatrix object with a valid CSS transform value.
   * * matrix(a, b, c, d, e, f) - valid matrix() transform function
   * * matrix3d(m11, m12, m13, ...m44) - valid matrix3d() transform function
   * * translate(tx, ty) rotateX(alpha) - any valid transform function(s)
   *
   * @param {string} source valid CSS transform string syntax.
   * @return {CSSMatrix} the resulted matrix.
   */
  function fromString(source) {
    var str = String(source).replace(/\s/g, '');
    var m = new CSSMatrix();
    var is2D = true;
    var tramsformObject = str.split(')').filter(function (f) { return f; }).map(function (fn) {
      var ref = fn.split('(');
      var prop = ref[0];
      var value = ref[1];
      var components = value.split(',')
        .map(function (n) { return (n.includes('rad') ? parseFloat(n) * (180 / Math.PI) : parseFloat(n)); });
      var x = components[0];
      var y = components[1];
      var z = components[2];
      var a = components[3];

      // don't add perspective if is2D
      if (prop === 'matrix3d'
          || (prop === 'rotate3d' && [x, y].every(function (n) { return !Number.isNaN(+n) && n !== 0; }) && a)
          || (['rotateX', 'rotateY'].includes(prop) && x)
          || (prop === 'translate3d' && [x, y, z].every(function (n) { return !Number.isNaN(+n); }) && z)
          || (prop === 'scale3d' && [x, y, z].every(function (n) { return !Number.isNaN(+n) && n !== x; }))
      ) {
        is2D = false;
      }
      return { prop: prop, components: components };
    });

    tramsformObject.forEach(function (tf) {
      var prop = tf.prop;
      var components = tf.components;
      var x = components[0];
      var y = components[1];
      var z = components[2];
      var a = components[3];
      var xyz = [x, y, z];
      var xyza = [x, y, z, a];

      if (prop === 'perspective' && !is2D) {
        m.m34 = -1 / x;
      } else if (prop.includes('matrix')) {
        var values = components.map(function (n) { return (Math.abs(n) < 1e-6 ? 0 : n); });
        if ([6, 16].includes(values.length)) {
          m = m.multiply(fromArray(values));
        }
      } else if (['translate', 'translate3d'].some(function (p) { return prop === p; }) && x) {
        m = m.translate(x, y || 0, z || 0);
      } else if (prop === 'rotate3d' && xyza.every(function (n) { return !Number.isNaN(+n); }) && a) {
        m = m.rotateAxisAngle(x, y, z, a);
      } else if (prop === 'scale3d' && xyz.every(function (n) { return !Number.isNaN(+n); }) && xyz.some(function (n) { return n !== 1; })) {
        m = m.scale(x, y, z);
      } else if (prop === 'rotate' && x) {
        m = m.rotate(0, 0, x);
      } else if (prop === 'scale' && !Number.isNaN(x) && x !== 1) {
        var nosy = Number.isNaN(+y);
        var sy = nosy ? x : y;
        m = m.scale(x, sy, 1);
      } else if (prop === 'skew' && (x || y)) {
        m = x ? m.skewX(x) : m;
        m = y ? m.skewY(y) : m;
      } else if (/[XYZ]/.test(prop) && x) {
        if (prop.includes('skew')) {
          // @ts-ignore unfortunately
          m = m[prop](x);
        } else {
          var fn = prop.replace(/[XYZ]/, '');
          var axis = prop.replace(fn, '');
          var idx = ['X', 'Y', 'Z'].indexOf(axis);
          var axeValues = [
            idx === 0 ? x : 0,
            idx === 1 ? x : 0,
            idx === 2 ? x : 0];
          // @ts-ignore unfortunately
          m = m[fn].apply(m, axeValues);
        }
      }
    });

    return m;
  }

  // Transform Functions
  // https://www.w3.org/TR/css-transforms-1/#transform-functions

  /**
   * Creates a new `CSSMatrix` for the translation matrix and returns it.
   * This method is equivalent to the CSS `translate3d()` function.
   *
   * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/translate3d
   *
   * @param {Number} x the `x-axis` position.
   * @param {Number} y the `y-axis` position.
   * @param {Number} z the `z-axis` position.
   * @return {CSSMatrix} the resulted matrix.
   */
  function Translate(x, y, z) {
    var m = new CSSMatrix();
    m.m41 = x;
    m.e = x;
    m.m42 = y;
    m.f = y;
    m.m43 = z;
    return m;
  }

  /**
   * Creates a new `CSSMatrix` for the rotation matrix and returns it.
   *
   * http://en.wikipedia.org/wiki/Rotation_matrix
   *
   * @param {Number} rx the `x-axis` rotation.
   * @param {Number} ry the `y-axis` rotation.
   * @param {Number} rz the `z-axis` rotation.
   * @return {CSSMatrix} the resulted matrix.
   */
  function Rotate(rx, ry, rz) {
    var m = new CSSMatrix();
    var degToRad = Math.PI / 180;
    var radX = rx * degToRad;
    var radY = ry * degToRad;
    var radZ = rz * degToRad;

    // minus sin() because of right-handed system
    var cosx = Math.cos(radX);
    var sinx = -Math.sin(radX);
    var cosy = Math.cos(radY);
    var siny = -Math.sin(radY);
    var cosz = Math.cos(radZ);
    var sinz = -Math.sin(radZ);

    var m11 = cosy * cosz;
    var m12 = -cosy * sinz;

    m.m11 = m11;
    m.a = m11;

    m.m12 = m12;
    m.b = m12;

    m.m13 = siny;

    var m21 = sinx * siny * cosz + cosx * sinz;
    m.m21 = m21;
    m.c = m21;

    var m22 = cosx * cosz - sinx * siny * sinz;
    m.m22 = m22;
    m.d = m22;

    m.m23 = -sinx * cosy;

    m.m31 = sinx * sinz - cosx * siny * cosz;
    m.m32 = sinx * cosz + cosx * siny * sinz;
    m.m33 = cosx * cosy;

    return m;
  }

  /**
   * Creates a new `CSSMatrix` for the rotation matrix and returns it.
   * This method is equivalent to the CSS `rotate3d()` function.
   *
   * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/rotate3d
   *
   * @param {Number} x the `x-axis` vector length.
   * @param {Number} y the `y-axis` vector length.
   * @param {Number} z the `z-axis` vector length.
   * @param {Number} alpha the value in degrees of the rotation.
   * @return {CSSMatrix} the resulted matrix.
   */
  function RotateAxisAngle(x, y, z, alpha) {
    var m = new CSSMatrix();
    var angle = alpha * (Math.PI / 360);
    var sinA = Math.sin(angle);
    var cosA = Math.cos(angle);
    var sinA2 = sinA * sinA;
    var length = Math.sqrt(x * x + y * y + z * z);
    var X = x;
    var Y = y;
    var Z = z;

    if (length === 0) {
      // bad vector length, use something reasonable
      X = 0;
      Y = 0;
      Z = 1;
    } else {
      X /= length;
      Y /= length;
      Z /= length;
    }

    var x2 = X * X;
    var y2 = Y * Y;
    var z2 = Z * Z;

    var m11 = 1 - 2 * (y2 + z2) * sinA2;
    m.m11 = m11;
    m.a = m11;

    var m12 = 2 * (X * Y * sinA2 + Z * sinA * cosA);
    m.m12 = m12;
    m.b = m12;

    m.m13 = 2 * (X * Z * sinA2 - Y * sinA * cosA);

    var m21 = 2 * (Y * X * sinA2 - Z * sinA * cosA);
    m.m21 = m21;
    m.c = m21;

    var m22 = 1 - 2 * (z2 + x2) * sinA2;
    m.m22 = m22;
    m.d = m22;

    m.m23 = 2 * (Y * Z * sinA2 + X * sinA * cosA);
    m.m31 = 2 * (Z * X * sinA2 + Y * sinA * cosA);
    m.m32 = 2 * (Z * Y * sinA2 - X * sinA * cosA);
    m.m33 = 1 - 2 * (x2 + y2) * sinA2;

    return m;
  }

  /**
   * Creates a new `CSSMatrix` for the scale matrix and returns it.
   * This method is equivalent to the CSS `scale3d()` function.
   *
   * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/scale3d
   *
   * @param {Number} x the `x-axis` scale.
   * @param {Number} y the `y-axis` scale.
   * @param {Number} z the `z-axis` scale.
   * @return {CSSMatrix} the resulted matrix.
   */
  function Scale(x, y, z) {
    var m = new CSSMatrix();
    m.m11 = x;
    m.a = x;

    m.m22 = y;
    m.d = y;

    m.m33 = z;
    return m;
  }

  /**
   * Creates a new `CSSMatrix` for the shear of the `x-axis` rotation matrix and
   * returns it. This method is equivalent to the CSS `skewX()` function.
   *
   * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/skewX
   *
   * @param {Number} angle the angle in degrees.
   * @return {CSSMatrix} the resulted matrix.
   */
  function SkewX(angle) {
    var m = new CSSMatrix();
    var radA = (angle * Math.PI) / 180;
    var t = Math.tan(radA);
    m.m21 = t;
    m.c = t;
    return m;
  }

  /**
   * Creates a new `CSSMatrix` for the shear of the `y-axis` rotation matrix and
   * returns it. This method is equivalent to the CSS `skewY()` function.
   *
   * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/skewY
   *
   * @param {Number} angle the angle in degrees.
   * @return {CSSMatrix} the resulted matrix.
   */
  function SkewY(angle) {
    var m = new CSSMatrix();
    var radA = (angle * Math.PI) / 180;
    var t = Math.tan(radA);
    m.m12 = t;
    m.b = t;
    return m;
  }

  /**
   * Creates a new `CSSMatrix` resulted from the multiplication of two matrixes
   * and returns it. Both matrixes are not changed.
   *
   * @param {CSSMatrix} m1 the first matrix.
   * @param {CSSMatrix} m2 the second matrix.
   * @return {CSSMatrix} the resulted matrix.
   */
  function Multiply(m1, m2) {
    var m11 = m2.m11 * m1.m11 + m2.m12 * m1.m21 + m2.m13 * m1.m31 + m2.m14 * m1.m41;
    var m12 = m2.m11 * m1.m12 + m2.m12 * m1.m22 + m2.m13 * m1.m32 + m2.m14 * m1.m42;
    var m13 = m2.m11 * m1.m13 + m2.m12 * m1.m23 + m2.m13 * m1.m33 + m2.m14 * m1.m43;
    var m14 = m2.m11 * m1.m14 + m2.m12 * m1.m24 + m2.m13 * m1.m34 + m2.m14 * m1.m44;

    var m21 = m2.m21 * m1.m11 + m2.m22 * m1.m21 + m2.m23 * m1.m31 + m2.m24 * m1.m41;
    var m22 = m2.m21 * m1.m12 + m2.m22 * m1.m22 + m2.m23 * m1.m32 + m2.m24 * m1.m42;
    var m23 = m2.m21 * m1.m13 + m2.m22 * m1.m23 + m2.m23 * m1.m33 + m2.m24 * m1.m43;
    var m24 = m2.m21 * m1.m14 + m2.m22 * m1.m24 + m2.m23 * m1.m34 + m2.m24 * m1.m44;

    var m31 = m2.m31 * m1.m11 + m2.m32 * m1.m21 + m2.m33 * m1.m31 + m2.m34 * m1.m41;
    var m32 = m2.m31 * m1.m12 + m2.m32 * m1.m22 + m2.m33 * m1.m32 + m2.m34 * m1.m42;
    var m33 = m2.m31 * m1.m13 + m2.m32 * m1.m23 + m2.m33 * m1.m33 + m2.m34 * m1.m43;
    var m34 = m2.m31 * m1.m14 + m2.m32 * m1.m24 + m2.m33 * m1.m34 + m2.m34 * m1.m44;

    var m41 = m2.m41 * m1.m11 + m2.m42 * m1.m21 + m2.m43 * m1.m31 + m2.m44 * m1.m41;
    var m42 = m2.m41 * m1.m12 + m2.m42 * m1.m22 + m2.m43 * m1.m32 + m2.m44 * m1.m42;
    var m43 = m2.m41 * m1.m13 + m2.m42 * m1.m23 + m2.m43 * m1.m33 + m2.m44 * m1.m43;
    var m44 = m2.m41 * m1.m14 + m2.m42 * m1.m24 + m2.m43 * m1.m34 + m2.m44 * m1.m44;

    return fromArray(
      [m11, m12, m13, m14,
        m21, m22, m23, m24,
        m31, m32, m33, m34,
        m41, m42, m43, m44]
    );
  }

  /**
   * Creates and returns a new `DOMMatrix` compatible *Object*
   * with equivalent instance methods.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrix
   * https://github.com/thednp/DOMMatrix/
   */

  var CSSMatrix = function CSSMatrix() {
    var assign;

    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];
    var m = this;
    // array 6
    m.a = 1; m.b = 0;
    m.c = 0; m.d = 1;
    m.e = 0; m.f = 0;
    // array 16
    m.m11 = 1; m.m12 = 0; m.m13 = 0; m.m14 = 0;
    m.m21 = 0; m.m22 = 1; m.m23 = 0; m.m24 = 0;
    m.m31 = 0; m.m32 = 0; m.m33 = 1; m.m34 = 0;
    m.m41 = 0; m.m42 = 0; m.m43 = 0; m.m44 = 1;

    if (args && args.length) {
      var ARGS = args;

      if (args instanceof Array) {
        if ((args[0] instanceof Array && [16, 6].includes(args[0].length))
          || typeof args[0] === 'string'
          || [CSSMatrix, DOMMatrix].some(function (x) { return args[0] instanceof x; })) {
          (assign = args, ARGS = assign[0]);
        }
      }
      return m.setMatrixValue(ARGS);
    }
    return m;
  };

  var prototypeAccessors = { isIdentity: { configurable: true },is2D: { configurable: true } };

  /**
   * Sets a new `Boolean` flag value for `this.isIdentity` matrix property.
   *
   * @param {Boolean} value sets a new flag for this property
   */
  prototypeAccessors.isIdentity.set = function (value) {
    this.isIdentity = value;
  };

  /**
   * A `Boolean` whose value is `true` if the matrix is the identity matrix. The identity
   * matrix is one in which every value is 0 except those on the main diagonal from top-left
   * to bottom-right corner (in other words, where the offsets in each direction are equal).
   *
   * @return {Boolean} the current property value
   */
  prototypeAccessors.isIdentity.get = function () {
    var m = this;
    return (m.m11 === 1 && m.m12 === 0 && m.m13 === 0 && m.m14 === 0
            && m.m21 === 0 && m.m22 === 1 && m.m23 === 0 && m.m24 === 0
            && m.m31 === 0 && m.m32 === 0 && m.m33 === 1 && m.m34 === 0
            && m.m41 === 0 && m.m42 === 0 && m.m43 === 0 && m.m44 === 1);
  };

  /**
   * A `Boolean` flag whose value is `true` if the matrix was initialized as a 2D matrix
   * and `false` if the matrix is 3D.
   *
   * @return {Boolean} the current property value
   */
  prototypeAccessors.is2D.get = function () {
    var m = this;
    return (m.m31 === 0 && m.m32 === 0 && m.m33 === 1 && m.m34 === 0 && m.m43 === 0 && m.m44 === 1);
  };

  /**
   * Sets a new `Boolean` flag value for `this.is2D` matrix property.
   *
   * @param {Boolean} value sets a new flag for this property
   */
  prototypeAccessors.is2D.set = function (value) {
    this.is2D = value;
  };

  /**
   * The `setMatrixValue` method replaces the existing matrix with one computed
   * in the browser. EG: `matrix(1,0.25,-0.25,1,0,0)`
   *
   * The method accepts any *Array* values, the result of
   * `DOMMatrix` instance method `toFloat64Array()` / `toFloat32Array()` calls
   *or `CSSMatrix` instance method `toArray()`.
   *
   * This method expects valid *matrix()* / *matrix3d()* string values, as well
   * as other transform functions like *translateX(10px)*.
   *
   * @param {String[] | Number[] | String | CSSMatrix | DOMMatrix} source
   * @return {CSSMatrix} a new matrix
   * can be one of the following
   * * valid CSS matrix string,
   * * 6/16 elements *Array*,
   * * CSSMatrix | DOMMatrix instance.
   */
  CSSMatrix.prototype.setMatrixValue = function setMatrixValue (source) {
    var m = this;

    // new CSSMatrix(CSSMatrix | DOMMatrix)
    if ([DOMMatrix, CSSMatrix].some(function (x) { return source instanceof x; })) {
      // @ts-ignore
      return fromMatrix(source);
    // CSS transform string source
    } if (typeof source === 'string' && source.length && source !== 'none') {
      return fromString(source);
    // [Arguments list | Array] come here
    } if (Array.isArray(source)) {
      // @ts-ignore
      return fromArray(source);
    }
    return m;
  };

  /**
   * Creates and returns a string representation of the matrix in `CSS` matrix syntax,
   * using the appropriate `CSS` matrix notation.
   *
   * The 16 items in the array 3D matrix array are *transposed* in row-major order.
   *
   * matrix3d *matrix3d(m11, m12, m13, m14, m21, ...)*
   * matrix *matrix(a, b, c, d, e, f)*
   *
   * @return {String} a string representation of the matrix
   */
  CSSMatrix.prototype.toString = function toString () {
    var m = this;
    var values = m.toArray().join(',');
    var type = m.is2D ? 'matrix' : 'matrix3d';
    return (type + "(" + values + ")");
  };

  /**
   * Returns an *Array* containing all 16 elements which comprise the matrix.
   * The method can return either the elements.
   *
   * Other methods make use of this method to feed their output values from this matrix.
   *
   * @return {Number[]} an *Array* representation of the matrix
   */
  CSSMatrix.prototype.toArray = function toArray () {
    var m = this;
    var pow6 = (Math.pow( 10, 6 ));
    var result;

    if (m.is2D) {
      result = [m.a, m.b, m.c, m.d, m.e, m.f];
    } else {
      result = [m.m11, m.m12, m.m13, m.m14,
        m.m21, m.m22, m.m23, m.m24,
        m.m31, m.m32, m.m33, m.m34,
        m.m41, m.m42, m.m43, m.m44];
    }
    // clean up the numbers
    // eslint-disable-next-line
    return result.map(function (n) { return (Math.abs(n) < 1e-6 ? 0 : ((n * pow6) >> 0) / pow6); });
  };

  /**
   * Returns a JSON representation of the `CSSMatrix` object, a standard *Object*
   * that includes `{a,b,c,d,e,f}` and `{m11,m12,m13,..m44}` properties and
   * excludes `is2D` & `isIdentity` properties.
   *
   * The result can also be used as a second parameter for the `fromMatrix` static method
   * to load values into a matrix instance.
   *
   * @return {Object} an *Object* with all matrix values.
   */
  CSSMatrix.prototype.toJSON = function toJSON () {
    return JSON.parse(JSON.stringify(this));
  };

  /**
   * The Multiply method returns a new CSSMatrix which is the result of this
   * matrix multiplied by the passed matrix, with the passed matrix to the right.
   * This matrix is not modified.
   *
   * @param {CSSMatrix} m2 CSSMatrix
   * @return {CSSMatrix} The result matrix.
   */
  CSSMatrix.prototype.multiply = function multiply (m2) {
    return Multiply(this, m2);
  };

  /**
   * The translate method returns a new matrix which is this matrix post
   * multiplied by a translation matrix containing the passed values. If the z
   * component is undefined, a 0 value is used in its place. This matrix is not
   * modified.
   *
   * @param {number} x X component of the translation value.
   * @param {number} y Y component of the translation value.
   * @param {number} z Z component of the translation value.
   * @return {CSSMatrix} The result matrix
   */
  CSSMatrix.prototype.translate = function translate (x, y, z) {
    var X = x;
    var Y = y;
    var Z = z;
    if (Z == null) { Z = 0; }
    if (Y == null) { Y = 0; }
    return Multiply(this, Translate(X, Y, Z));
  };

  /**
   * The scale method returns a new matrix which is this matrix post multiplied by
   * a scale matrix containing the passed values. If the z component is undefined,
   * a 1 value is used in its place. If the y component is undefined, the x
   * component value is used in its place. This matrix is not modified.
   *
   * @param {number} x The X component of the scale value.
   * @param {number} y The Y component of the scale value.
   * @param {number} z The Z component of the scale value.
   * @return {CSSMatrix} The result matrix
   */
  CSSMatrix.prototype.scale = function scale (x, y, z) {
    var X = x;
    var Y = y;
    var Z = z;
    if (Y == null) { Y = x; }
    if (Z == null) { Z = x; }

    return Multiply(this, Scale(X, Y, Z));
  };

  /**
   * The rotate method returns a new matrix which is this matrix post multiplied
   * by each of 3 rotation matrices about the major axes, first X, then Y, then Z.
   * If the y and z components are undefined, the x value is used to rotate the
   * object about the z axis, as though the vector (0,0,x) were passed. All
   * rotation values are in degrees. This matrix is not modified.
   *
   * @param {number} rx The X component of the rotation, or Z if Y and Z are null.
   * @param {number} ry The (optional) Y component of the rotation value.
   * @param {number} rz The (optional) Z component of the rotation value.
   * @return {CSSMatrix} The result matrix
   */
  CSSMatrix.prototype.rotate = function rotate (rx, ry, rz) {
    var RX = rx;
    var RY = ry;
    var RZ = rz;
    if (RY == null) { RY = 0; }
    if (RZ == null) { RZ = RX; RX = 0; }
    return Multiply(this, Rotate(RX, RY, RZ));
  };

  /**
   * The rotateAxisAngle method returns a new matrix which is this matrix post
   * multiplied by a rotation matrix with the given axis and `angle`. The right-hand
   * rule is used to determine the direction of rotation. All rotation values are
   * in degrees. This matrix is not modified.
   *
   * @param {number} x The X component of the axis vector.
   * @param {number} y The Y component of the axis vector.
   * @param {number} z The Z component of the axis vector.
   * @param {number} angle The angle of rotation about the axis vector, in degrees.
   * @return {CSSMatrix} The `CSSMatrix` result
   */
  CSSMatrix.prototype.rotateAxisAngle = function rotateAxisAngle (x, y, z, angle) {
    if (arguments.length !== 4) {
      throw new TypeError('CSSMatrix: expecting 4 values');
    }
    return Multiply(this, RotateAxisAngle(x, y, z, angle));
  };

  /**
   * Specifies a skew transformation along the `x-axis` by the given angle.
   * This matrix is not modified.
   *
   * @param {number} angle The angle amount in degrees to skew.
   * @return {CSSMatrix} The `CSSMatrix` result
   */
  CSSMatrix.prototype.skewX = function skewX (angle) {
    return Multiply(this, SkewX(angle));
  };

  /**
   * Specifies a skew transformation along the `y-axis` by the given angle.
   * This matrix is not modified.
   *
   * @param {number} angle The angle amount in degrees to skew.
   * @return {CSSMatrix} The `CSSMatrix` result
   */
  CSSMatrix.prototype.skewY = function skewY (angle) {
    return Multiply(this, SkewY(angle));
  };

  /**
   * Transforms the specified point using the matrix, returning a new
   * Tuple *Object* comprising of the transformed point.
   * Neither the matrix nor the original point are altered.
   *
   * The method is equivalent with `transformPoint()` method
   * of the `DOMMatrix` constructor.
   *
   * JavaScript implementation by thednp
   *
   * @param {{x: number, y: number, z: number, w: number}} v Tuple with `{x,y,z,w}` components
   * @return {{x: number, y: number, z: number, w: number}} the resulting Tuple
   */
  CSSMatrix.prototype.transformPoint = function transformPoint (v) {
    var M = this;
    var m = Translate(v.x, v.y, v.z);

    m.m44 = v.w || 1;
    m = M.multiply(m);

    return {
      x: m.m41,
      y: m.m42,
      z: m.m43,
      w: m.m44,
    };
  };

  /**
   * Transforms the specified vector using the matrix, returning a new
   * {x,y,z,w} Tuple *Object* comprising the transformed vector.
   * Neither the matrix nor the original vector are altered.
   *
   * @param {{x: number, y: number, z: number, w: number}} t Tuple with `{x,y,z,w}` components
   * @return {{x: number, y: number, z: number, w: number}} the resulting Tuple
   */
  CSSMatrix.prototype.transform = function transform (t) {
    var m = this;
    var x = m.m11 * t.x + m.m12 * t.y + m.m13 * t.z + m.m14 * t.w;
    var y = m.m21 * t.x + m.m22 * t.y + m.m23 * t.z + m.m24 * t.w;
    var z = m.m31 * t.x + m.m32 * t.y + m.m33 * t.z + m.m34 * t.w;
    var w = m.m41 * t.x + m.m42 * t.y + m.m43 * t.z + m.m44 * t.w;

    return {
      x: x / w,
      y: y / w,
      z: z / w,
      w: w,
    };
  };

  Object.defineProperties( CSSMatrix.prototype, prototypeAccessors );

  // Add Transform Functions to CSSMatrix object
  CSSMatrix.Translate = Translate;
  CSSMatrix.Rotate = Rotate;
  CSSMatrix.RotateAxisAngle = RotateAxisAngle;
  CSSMatrix.Scale = Scale;
  CSSMatrix.SkewX = SkewX;
  CSSMatrix.SkewY = SkewY;
  CSSMatrix.Multiply = Multiply;
  CSSMatrix.fromArray = fromArray;
  CSSMatrix.fromMatrix = fromMatrix;
  CSSMatrix.fromString = fromString;

  return CSSMatrix;

}));
