/**
 * DOMMatrix shim - CSSMatrix
 *
 * Creates and returns a new `DOMMatrix` compatible *Object*
 * with equivalent instance methods.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrix
 * https://github.com/thednp/DOMMatrix/
 *
 * @param {String} String valid CSS transform in `matrix()`/`matrix3d()` format
 * @param {Array} Array expected to be *Float64Array* or *Float32Array* in the column major order.
 * @param {[a,b,c,d,e,f]} Arguments representing the 6 elements of a 2d matrix
 * @param {[m11,m21,m31,m41..]} Arguments representing the 16 elements of a 3d matrix
 */

class CSSMatrix {
  constructor(...args) {
    this.setIdentity();
    return args && args.length && this.setMatrixValue(args);
  }

  /**
   * A `Boolean` whose value is `true` if the matrix is the identity matrix. The identity
   * matrix is one in which every value is 0 except those on the main diagonal from top-left
   * to bottom-right corner (in other words, where the offsets in each direction are equal).
   *
   * @return {Boolean} `Boolean` the current property value
   */
  get isIdentity() {
    const m = this;
    return (m.m11 === 1 && m.m12 === 0 && m.m13 === 0 && m.m14 === 0
            && m.m21 === 0 && m.m22 === 1 && m.m23 === 0 && m.m24 === 0
            && m.m31 === 0 && m.m32 === 0 && m.m33 === 1 && m.m34 === 0
            && m.m41 === 0 && m.m42 === 0 && m.m43 === 0 && m.m44 === 1);
  }

  /**
   * Sets a new `Boolean` flag value for `this.isIdentity` matrix property.
   *
   * @param {Boolean} value sets a new `Boolean` flag for this property
   */
  set isIdentity(value) {
    this.isIdentity = value;
  }

  /**
   * A `Boolean` flag whose value is `true` if the matrix was initialized as a 2D matrix
   * and `false` if the matrix is 3D.
   *
   * @return {Boolean} `Boolean` the current property value
   */
  get is2D() {
    const m = this;
    return (m.m31 === 0 && m.m32 === 0 && m.m33 === 1 && m.m34 === 0 && m.m43 === 0 && m.m44 === 1);
  }

  /**
   * Sets a new `Boolean` flag value for `this.is2D` matrix property.
   *
   * @param {Boolean} value sets a new `Boolean` flag for this property
   */
  set is2D(value) {
    this.is2D = value;
  }
}

// export proto for custom compile via Buble
const CSSMatrixProto = CSSMatrix.prototype;

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
 */
function Translate(x, y, z) {
  const m = new CSSMatrix();
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
 */

function Rotate(rx, ry, rz) {
  const m = new CSSMatrix();

  const radX = (rx * Math.PI) / 180;
  const radY = (ry * Math.PI) / 180;
  const radZ = (rz * Math.PI) / 180;

  // minus sin() because of right-handed system
  const cosx = Math.cos(radX);
  const sinx = -Math.sin(radX);
  const cosy = Math.cos(radY);
  const siny = -Math.sin(radY);
  const cosz = Math.cos(radZ);
  const sinz = -Math.sin(radZ);

  const cycz = cosy * cosz;
  const cysz = -cosy * sinz;

  m.m11 = cycz;
  m.a = cycz;

  m.m12 = cysz;
  m.b = cysz;

  m.m13 = siny;

  const sxsy = sinx * siny * cosz + cosx * sinz;
  m.m21 = sxsy;
  m.c = sxsy;

  const cxcz = cosx * cosz - sinx * siny * sinz;
  m.m22 = cxcz;
  m.d = cxcz;

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
 * @param {Number} angle the value in degrees of the rotation.
 */
function RotateAxisAngle(x, y, z, angle) {
  const m = new CSSMatrix();
  const radA = (angle * Math.PI) / 360;
  const sinA = Math.sin(radA);
  const cosA = Math.cos(radA);
  const sinA2 = sinA * sinA;
  const length = Math.sqrt(x * x + y * y + z * z);
  let X = 0;
  let Y = 0;
  let Z = 1;

  // bad vector length, use something reasonable
  if (length !== 0) {
    X = x / length;
    Y = y / length;
    Z = z / length;
  }

  const x2 = X * X;
  const y2 = Y * Y;
  const z2 = Z * Z;

  const m11 = 1 - 2 * (y2 + z2) * sinA2;
  m.m11 = m11;
  m.a = m11;

  const m12 = 2 * (x * y * sinA2 + z * sinA * cosA);
  m.m12 = m12;
  m.b = m12;

  m.m13 = 2 * (x * z * sinA2 - y * sinA * cosA);

  const m21 = 2 * (y * x * sinA2 - z * sinA * cosA);
  m.m21 = m21;
  m.c = m21;

  const m22 = 1 - 2 * (z2 + x2) * sinA2;
  m.m22 = m22;
  m.d = m22;

  m.m23 = 2 * (y * z * sinA2 + x * sinA * cosA);
  m.m31 = 2 * (z * x * sinA2 + y * sinA * cosA);
  m.m32 = 2 * (z * y * sinA2 - x * sinA * cosA);
  m.m33 = 1 - 2 * (x2 + y2) * sinA2;

  m.m14 = 0;
  m.m24 = 0;
  m.m34 = 0;

  m.m41 = 0;
  m.e = 0;
  m.m42 = 0;
  m.f = 0;
  m.m43 = 0;

  m.m44 = 1;

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
 */
function Scale(x, y, z) {
  const m = new CSSMatrix();
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
 */
function SkewX(angle) {
  const radA = (angle * Math.PI) / 180;
  const m = new CSSMatrix();
  const t = Math.tan(radA);
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
 */
function SkewY(angle) {
  const radA = (angle * Math.PI) / 180;
  const m = new CSSMatrix();
  const t = Math.tan(radA);
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
 */
function Multiply(m1, m2) {
  const m11 = m2.m11 * m1.m11 + m2.m12 * m1.m21 + m2.m13 * m1.m31 + m2.m14 * m1.m41;
  const m12 = m2.m11 * m1.m12 + m2.m12 * m1.m22 + m2.m13 * m1.m32 + m2.m14 * m1.m42;
  const m13 = m2.m11 * m1.m13 + m2.m12 * m1.m23 + m2.m13 * m1.m33 + m2.m14 * m1.m43;
  const m14 = m2.m11 * m1.m14 + m2.m12 * m1.m24 + m2.m13 * m1.m34 + m2.m14 * m1.m44;

  const m21 = m2.m21 * m1.m11 + m2.m22 * m1.m21 + m2.m23 * m1.m31 + m2.m24 * m1.m41;
  const m22 = m2.m21 * m1.m12 + m2.m22 * m1.m22 + m2.m23 * m1.m32 + m2.m24 * m1.m42;
  const m23 = m2.m21 * m1.m13 + m2.m22 * m1.m23 + m2.m23 * m1.m33 + m2.m24 * m1.m43;
  const m24 = m2.m21 * m1.m14 + m2.m22 * m1.m24 + m2.m23 * m1.m34 + m2.m24 * m1.m44;

  const m31 = m2.m31 * m1.m11 + m2.m32 * m1.m21 + m2.m33 * m1.m31 + m2.m34 * m1.m41;
  const m32 = m2.m31 * m1.m12 + m2.m32 * m1.m22 + m2.m33 * m1.m32 + m2.m34 * m1.m42;
  const m33 = m2.m31 * m1.m13 + m2.m32 * m1.m23 + m2.m33 * m1.m33 + m2.m34 * m1.m43;
  const m34 = m2.m31 * m1.m14 + m2.m32 * m1.m24 + m2.m33 * m1.m34 + m2.m34 * m1.m44;

  const m41 = m2.m41 * m1.m11 + m2.m42 * m1.m21 + m2.m43 * m1.m31 + m2.m44 * m1.m41;
  const m42 = m2.m41 * m1.m12 + m2.m42 * m1.m22 + m2.m43 * m1.m32 + m2.m44 * m1.m42;
  const m43 = m2.m41 * m1.m13 + m2.m42 * m1.m23 + m2.m43 * m1.m33 + m2.m44 * m1.m43;
  const m44 = m2.m41 * m1.m14 + m2.m42 * m1.m24 + m2.m43 * m1.m34 + m2.m44 * m1.m44;

  return new CSSMatrix(
    [m11, m21, m31, m41,
      m12, m22, m32, m42,
      m13, m23, m33, m43,
      m14, m24, m34, m44],
  );
}

/**
 * Returns a new *Float32Array* containing all 16 elements which comprise the matrix.
 * The elements are stored into the array as single-precision floating-point numbers
 * in column-major (colexographical access access or "colex") order.
 *
 * @return {Float32Array} matrix elements (m11, m21, m31, m41, ..)
 */
// toFloat32Array(){
//   return Float32Array.from(this.toArray());
// }

/**
 * Returns a new Float64Array containing all 16 elements which comprise the matrix.
 * The elements are stored into the array as double-precision floating-point numbers
 * in column-major (colexographical access access or "colex") order.
 *
 * @return {Float64Array} matrix elements (m11, m21, m31, m41, ..)
 */
// toFloat64Array(){
//   return Float64Array.from(this.toArray());
// }

/**
 * Creates a new mutable `CSSMatrix` object given an existing matrix or a
 * `DOMMatrix` *Object* which provides the values for its properties.
 *
 * @param {CSSMatrix} CSSMatrix the source `CSSMatrix` initialization to feed values from
 */
function fromMatrix(m) {
  return new CSSMatrix(
    // DOMMatrix elements order
    [m.m11, m.m21, m.m31, m.m41,
      m.m12, m.m22, m.m32, m.m42,
      m.m13, m.m23, m.m33, m.m43,
      m.m14, m.m24, m.m34, m.m44],
  );
}

/**
 * Feed a CSSMatrix object with the values of a 6/16 values array and returns it.
 *
 * @param {Array} array The source `Array` to feed values from.
 * @return {CSSMatrix} a The source array to feed values from.
 */
function feedFromArray(m, array) {
  const a = Array.from(array);
  if (a.length === 16) {
    const [m11, m21, m31, m41,
      m12, m22, m32, m42,
      m13, m23, m33, m43,
      m14, m24, m34, m44] = a;

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
    const [m11, m12, m21, m22, m14, m24] = a;

    m.m11 = m11;
    m.a = m11;

    m.m12 = m12;
    m.b = m12;

    m.m21 = m21;
    m.c = m21;

    m.m22 = m22;
    m.d = m22;

    m.m14 = m14;
    m.e = m14;

    m.m24 = m24;
    m.f = m24;
  } else {
    throw new TypeError('CSSMatrix: expecting a 6/16 values Array');
  }
  return m;
}

/**
 * Creates a new mutable `CSSMatrix` object given an array float values.
 *
 * If the array has six values, the result is a 2D matrix; if the array has 16 values,
 * the result is a 3D matrix. Otherwise, a TypeError exception is thrown.
 *
 * @param {Array} array The source `Array` to feed values from.
 * @return {CSSMatrix} a The source array to feed values from.
 */
function fromArray(a) {
  return feedFromArray(new CSSMatrix(), a);
}

/**
 * Each create a new mutable `CSSMatrix` object given an array of single/double-precision
 * (32/64 bit) floating-point values.
 *
 * If the array has six values, the result is a 2D matrix; if the array has 16 values,
 * the result is a 3D matrix. Otherwise, a TypeError exception is thrown.
 *
 * @param {Float32Array|Float64Array} array The source float array to feed values from.
 * @return {CSSMatrix} a The source array to feed values from.
 */
// more of an alias for now, will update later if it's the case
// function fromFloat32Array(a){
//   return feedFromArray(new CSSMatrix(), a);
// }
// function fromFloat64Array(a){ // more of an alias
//   return feedFromArray(new CSSMatrix(), a);
// }

/**
 * The `setMatrixValue` method replaces the existing matrix with one computed
 * in the browser. EG: `matrix(1,0.25,-0.25,1,0,0)`
 *
 * The method accepts *Float64Array* / *Float32Array* / any *Array* values, the result of
 * `DOMMatrix` / `CSSMatrix` instance method calls `toFloat64Array()` / `toFloat32Array()`.
 *
 * This method expects valid *matrix()* / *matrix3d()* string values, other
 * transform functions like *translate()* are not supported.
 *
 * @param {String} source the *String* resulted from `getComputedStyle()`.
 * @param {Array} source the *Array* resulted from `toFloat64Array()`.
 */
CSSMatrixProto.setMatrixValue = function setMatrixValue(source) {
  const m = this;

  if (!source || !source.length) { // no parameters or source
    return m;
  } if (source.length && typeof source[0] === 'string' && source[0].length) { // CSS transform String source
    const string = String(source[0]).trim();
    let type = '';
    let values = [];

    if (string === 'none') return m;

    type = string.slice(0, string.indexOf('('));
    values = string.slice((type === 'matrix' ? 7 : 9), -1).split(',')
      .map((n) => (Math.abs(n) < 1e-6 ? 0 : +n));

    if ([6, 16].indexOf(values.length) > -1) {
      feedFromArray(m, values);
    } else {
      throw new TypeError('CSSMatrix: expecting valid CSS matrix() / matrix3d() syntax');
    }
  } else if (source[0] instanceof CSSMatrix) { // CSSMatrix instance
    feedFromArray(m, source[0].toArray());
  } else if (Array.isArray(source[0])) { // Float32Array,Float64Array source
    feedFromArray(m, source[0]);
  } else if (Array.isArray(source)) { // Arguments list come here
    feedFromArray(m, source);
  }
  return m;
};

/**
 * Creates and returns a string representation of the matrix in `CSS` matrix syntax,
 * using the appropriate `CSS` matrix notation.
 *
 * The 16 items in the array 3D matrix array are *transposed* in row-major order.
 *
 * @matrix3d *matrix3d(m11, m12, m13, m14, m21, ...)*
 * @matrix *matrix(a, b, c, d, e, f)*
 *
 * @return {String} `String` representation of the matrix
 */
CSSMatrixProto.toString = function toString() {
  const m = this;
  const type = m.is2D ? 'matrix' : 'matrix3d';

  return `${type}(${m.toArray(1).join(',')})`;
};

/**
 * Returns an *Array* containing all 16 elements which comprise the matrix.
 * The method can return either the elements in default column major order or
 * row major order (what we call the *transposed* matrix, used by `toString`).
 *
 * Other methods make use of this method to feed their output values from this matrix.
 *
 * @param {Boolean} transposed changes the order of elements in the output
 * @return {Array} an *Array* representation of the matrix
 */
CSSMatrixProto.toArray = function toArray(transposed) {
  const m = this;
  let result;

  if (m.is2D) {
    result = [m.a, m.b, m.c, m.d, m.e, m.f];
  } else if (transposed) {
    result = [m.m11, m.m12, m.m13, m.m14, // transposed is used by toString
      m.m21, m.m22, m.m23, m.m24,
      m.m31, m.m32, m.m33, m.m34,
      m.m41, m.m42, m.m43, m.m44];
  } else {
    result = [m.m11, m.m21, m.m31, m.m41, // used by constructor
      m.m12, m.m22, m.m32, m.m42,
      m.m13, m.m23, m.m33, m.m43,
      m.m14, m.m24, m.m34, m.m44];
  }
  return result;
};

/**
 * The Multiply method returns a new CSSMatrix which is the result of this
 * matrix multiplied by the passed matrix, with the passed matrix to the right.
 * This matrix is not modified.
 *
 * @param {CSSMatrix} m2 CSSMatrix
 * @return {CSSMatrix} The result matrix.
 */
CSSMatrixProto.multiply = function multiply(m2) {
  return Multiply(this, m2);
};

/**
 *
 * These methods will be implemented later into an extended version to provide
 * additional functionality.
 */
// inverse = function(){}
// determinant = function(){}
// transpose = function(){}

/**
 * The translate method returns a new matrix which is this matrix post
 * multiplied by a translation matrix containing the passed values. If the z
 * component is undefined, a 0 value is used in its place. This matrix is not
 * modified.
 *
 * @param {number} x X component of the translation value.
 * @param {number} y Y component of the translation value.
 * @param {number=} z Z component of the translation value.
 * @return {CSSMatrix} The result matrix
 */

CSSMatrixProto.translate = function translate(x, y, z) {
  const X = x;
  let Y = y;
  let Z = z;
  if (Z == null) Z = 0;
  if (Y == null) Y = 0;
  return Multiply(this, Translate(X, Y, Z));
};

/**
 * The scale method returns a new matrix which is this matrix post multiplied by
 * a scale matrix containing the passed values. If the z component is undefined,
 * a 1 value is used in its place. If the y component is undefined, the x
 * component value is used in its place. This matrix is not modified.
 *
 * @param {number} x The X component of the scale value.
 * @param {number=} y The Y component of the scale value.
 * @param {number=} z The Z component of the scale value.
 * @return {CSSMatrix} The result matrix
 */
CSSMatrixProto.scale = function scale(x, y, z) {
  const X = x;
  let Y = y;
  let Z = z;
  if (Y == null) Y = x;
  if (Z == null) Z = x;

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
 * @param {number=} ry The (optional) Y component of the rotation value.
 * @param {number=} rz The (optional) Z component of the rotation value.
 * @return {CSSMatrix} The result matrix
 */
CSSMatrixProto.rotate = function rotate(rx, ry, rz) {
  let RX = rx;
  let RY = ry;
  let RZ = rz;
  if (RY == null) RY = 0;
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

CSSMatrixProto.rotateAxisAngle = function rotateAxisAngle(x, y, z, angle) {
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

CSSMatrixProto.skewX = function skewX(angle) {
  return Multiply(this, SkewX(angle));
};

/**
 * Specifies a skew transformation along the `y-axis` by the given angle.
 * This matrix is not modified.
 *
 * @param {number} angle The angle amount in degrees to skew.
 * @return {CSSMatrix} The `CSSMatrix` result
 */

CSSMatrixProto.skewY = function skewY(angle) {
  return Multiply(this, SkewY(angle));
};

/**
 * Set the current `CSSMatrix` instance to the identity form and returns it.
 *
 * @return {CSSMatrix} this `CSSMatrix` instance
 */
CSSMatrixProto.setIdentity = function setIdentity() {
  const identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  return feedFromArray(this, identity);
};

/**
 * Transforms the specified point using the matrix, returning a new
 * *Object* containing the transformed point.
 * Neither the matrix nor the original point are altered.
 *
 * The method is equivalent with `transformPoint()` method
 * of the `DOMMatrix` constructor.
 *
 * JavaScript implementation by thednp
 *
 * @param {Point} point the *Object* with `x`, `y`, `z` and `w` components
 * @return {Point} a new `{x,y,z,w}` *Object*
 */
CSSMatrixProto.transformPoint = function transformPoint(v) {
  const M = this;
  let m = Translate(v.x, v.y, v.z);

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
 * {x,y,z,w} *Object* comprising the transformed vector.
 * Neither the matrix nor the original vector are altered.
 *
 * @param {Tuple} tupple an object with x, y, z and w components
 * @return {Tuple} the passed tuple
 */
CSSMatrixProto.transform = function transform(t) {
  const m = this;
  const x = m.m11 * t.x + m.m12 * t.y + m.m13 * t.z + m.m14 * t.w;
  const y = m.m21 * t.x + m.m22 * t.y + m.m23 * t.z + m.m24 * t.w;
  const z = m.m31 * t.x + m.m32 * t.y + m.m33 * t.z + m.m34 * t.w;
  const w = m.m41 * t.x + m.m42 * t.y + m.m43 * t.z + m.m44 * t.w;

  return {
    x: x / w,
    y: y / w,
    z: z / w,
    w,
  };
};

// Add Transform Functions to CSSMatrix object
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

export default CSSMatrix;
