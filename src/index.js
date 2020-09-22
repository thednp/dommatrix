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
function Translate(x, y, z){
  let m = new CSSMatrix();
  m.m41 = m.e = x;
  m.m42 = m.f = y;
  m.m43 = z;
  return m
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

function Rotate(rx, ry, rz){
  let m = new CSSMatrix()

  rx *= Math.PI / 180
  ry *= Math.PI / 180
  rz *= Math.PI / 180

  // minus sin() because of right-handed system
  let cosx = Math.cos(rx), sinx = -Math.sin(rx),
      cosy = Math.cos(ry), siny = -Math.sin(ry),
      cosz = Math.cos(rz), sinz = -Math.sin(rz);

  m.m11 = m.a = cosy * cosz
  m.m12 = m.b = -cosy * sinz
  m.m13 = siny

  m.m21 = m.c = sinx * siny * cosz + cosx * sinz
  m.m22 = m.d = cosx * cosz - sinx * siny * sinz
  m.m23 = -sinx * cosy

  m.m31 = sinx * sinz - cosx * siny * cosz
  m.m32 = sinx * cosz + cosx * siny * sinz
  m.m33 = cosx * cosy

  return m
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
function RotateAxisAngle(x, y, z, angle){
  angle *= Math.PI / 360;

  let sinA = Math.sin(angle), 
      cosA = Math.cos(angle), 
      sinA2 = sinA * sinA,
      length = Math.sqrt(x * x + y * y + z * z);

  if (length === 0){
    // bad vector length, use something reasonable
    x = 0;
    y = 0;
    z = 1;
  } else {
    x /= length;
    y /= length;
    z /= length;
  }

  let x2 = x * x, y2 = y * y, z2 = z * z;

  let m = new CSSMatrix();
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
function Scale(x, y, z){
  let m = new CSSMatrix();
  m.m11 = m.a = x;
  m.m22 = m.d = y;
  m.m33 = z;
  return m
}

/**
 * Creates a new `CSSMatrix` for the shear of the `x-axis` rotation matrix and 
 * returns it. This method is equivalent to the CSS `skewX()` function.
 * 
 * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/skewX
 *  
 * @param {Number} angle the angle in degrees.
 */
function SkewX(angle){
  angle *= Math.PI / 180;
  let m = new CSSMatrix();
  m.m21 = m.c = Math.tan(angle);
  return m
}

/**
 * Creates a new `CSSMatrix` for the shear of the `y-axis` rotation matrix and 
 * returns it. This method is equivalent to the CSS `skewY()` function.
 * 
 * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/skewY
 *  
 * @param {Number} angle the angle in degrees.
 */
function SkewY(angle){
  angle *= Math.PI / 180;
  let m = new CSSMatrix();
  m.m12 = m.b = Math.tan(angle);
  return m
}

/**
 * Creates a new `CSSMatrix` resulted from the multiplication of two matrixes 
 * and returns it. Both matrixes are not changed.
 * 
 * @param {CSSMatrix} m1 the first matrix.
 * @param {CSSMatrix} m2 the second matrix.
 */
function Multiply(m1, m2){
  let m11 = m2.m11 * m1.m11 + m2.m12 * m1.m21 + m2.m13 * m1.m31 + m2.m14 * m1.m41,
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
      m44 = m2.m41 * m1.m14 + m2.m42 * m1.m24 + m2.m43 * m1.m34 + m2.m44 * m1.m44

  return new CSSMatrix(
   [m11, m21, m31, m41,
    m12, m22, m32, m42,
    m13, m23, m33, m43,
    m14, m24, m34, m44])
}


/**
 * Returns a new *Float32Array* containing all 16 elements which comprise the matrix. 
 * The elements are stored into the array as single-precision floating-point numbers 
 * in column-major (colexographical access access or "colex") order. 
 * 
 * @return {Float32Array} matrix elements (m11, m21, m31, m41, m12, m22, m32, m42, m13, m23, m33, m43, m14, m24, m34, m44) 
 */
// toFloat32Array(){
// 	return Float32Array.from(this.toArray())
// }

/**
 * Returns a new Float64Array containing all 16 elements which comprise the matrix. 
 * The elements are stored into the array as double-precision floating-point numbers 
 * in column-major (colexographical access access or "colex") order. 
 * 
 * @return {Float64Array} matrix elements (m11, m21, m31, m41, m12, m22, m32, m42, m13, m23, m33, m43, m14, m24, m34, m44) 
 */	
// toFloat64Array(){
// 	return Float64Array.from(this.toArray())
// }

/**
 * Creates a new mutable `CSSMatrix` object given an existing matrix or a 
 * `DOMMatrix` *Object* which provides the values for its properties.
 * 
 * @param {CSSMatrix} CSSMatrix the source `CSSMatrix` / `DOMMatrix` initialization to feed values from
 */
function fromMatrix(m){
  return new CSSMatrix(
    // DOMMatrix elements order
   [m.m11, m.m21, m.m31, m.m41, 
    m.m12, m.m22, m.m32, m.m42,
    m.m13, m.m23, m.m33, m.m43,
    m.m14, m.m24, m.m34, m.m44])
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
function fromArray(a){
  return feedFromArray(new CSSMatrix(),a)
}

/**
 * Each create a new mutable `CSSMatrix` object given an array of single/double-precision 
 * (32/64 bit) floating-point values.
 *  
 * If the array has six values, the result is a 2D matrix; if the array has 16 values, 
 * the result is a 3D matrix. Otherwise, a TypeError exception is thrown.
 * 
 * @param {Float32Array|Float64Array} array The source `Float32Array` / `Float64Array` to feed values from.
 * @return {CSSMatrix} a The source array to feed values from.
 */
// more of an alias for now, will update later if it's the case
// function fromFloat32Array(a){ 
// 	return feedFromArray(new CSSMatrix(),a)
// }
// function fromFloat64Array(a){ // more of an alias
// 	return feedFromArray(new CSSMatrix(),a)
// }

/**
 * Feed a CSSMatrix object with the values of a 6/16 values array and returns it.
 * 
 * @param {Array} array The source `Array` to feed values from.
 * @return {CSSMatrix} a The source array to feed values from.
 */
function feedFromArray(m,array){
  let a = Array.from(array)
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
    console.error(`CSSMatrix: expecting a 6/16 values Array`)
  }
  return m
}

/**
 * Creates and returns a new `DOMMatrix` compatible *Object*
 * with equivalent instance methods.
 * 
 * https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrix
 * https://github.com/thednp/DOMMatrix/
 * 
 * @param {String} String valid CSS transform in `matrix()`/`matrix3d()` format
 * @param {Array} Array expected to be *Float64Array* or *Float32Array* in the correct column major order described in the specification.
 * @param {[a,b,c,d,e,f]} Arguments representing the 6 elements of a 2d matrix
 * @param {[m11,m21,m31,m41,m12,m22,m32,m42,m13,m23,m33,m43,m14,m24,m34,m44]} Arguments representing the 16 elements of a 3d matrix
 */

export default class CSSMatrix {
  constructor(...args){
    this.setIdentity()
    return args && args.length && this.setMatrixValue(args)
  }  

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
  setMatrixValue(source){
    let m = this

    if (!source || !source.length) { // no parameters or source
      return m
    } else if (source.length && typeof source[0] === 'string' && source[0].length) { // CSS transform String source
      let string = String(source[0]).trim(), type = '', values = [];

      if (string == 'none') return m;
  
      type = string.slice(0, string.indexOf('('))
      values = string.slice((type === 'matrix' ? 7 : 9), -1).split(',')
                    .map(n=>Math.abs(n) < 1e-6 ? 0 : +n)

      if ([6,16].indexOf(values.length)>-1){
        feedFromArray(m,values)
      } else {
        console.error(`CSSMatrix: expecting valid CSS matrix() / matrix3d() syntax`)
      }
    } else if (source[0] instanceof CSSMatrix) { // CSSMatrix instance
      feedFromArray(m,source[0].toArray())
    } else if (Array.isArray(source[0])) { // Float32Array,Float64Array source
      feedFromArray(m,source[0])    
    } else if (Array.isArray(source)) { // Arguments list come here
      feedFromArray(m,source)  
    }
    return m
  }
  
  /**
   * Creates and returns a string representation of the matrix in `CSS` matrix syntax, 
   * using the appropriate `CSS` matrix notation.
   * 
   * The 16 items in the array 3D matrix array are *transposed* in row-major order.
   * 
   * @matrix3d *matrix3d(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44)*
   * @matrix *matrix(a, b, c, d, e, f)*
   * 
   * @return {String} `String` representation of the matrix
   */
  toString(){
    let m = this, type = m.is2D ? 'matrix' : 'matrix3d'
    return `${type}(${m.toArray(1).join(',')})`
  }

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
  toArray(transposed){
    let m = this
    return m.is2D ? [ m.a, m.b, m.c, m.d, m.e, m.f ]
      : transposed
      ?[m.m11, m.m12, m.m13, m.m14, // transposed is used by toString
        m.m21, m.m22, m.m23, m.m24,
        m.m31, m.m32, m.m33, m.m34,
        m.m41, m.m42, m.m43, m.m44]
      :[m.m11, m.m21, m.m31, m.m41, // used by constructor
        m.m12, m.m22, m.m32, m.m42,
        m.m13, m.m23, m.m33, m.m43,
        m.m14, m.m24, m.m34, m.m44]
  }

  /**
   * The Multiply method returns a new CSSMatrix which is the result of this
   * matrix multiplied by the passed matrix, with the passed matrix to the right.
   * This matrix is not modified.
   *
   * @param {CSSMatrix} m2 CSSMatrix  
   * @return {CSSMatrix} The result matrix.
   */
  multiply(m2){
    return Multiply(this,m2)
  }

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

  translate(x, y, z){
    if (z == null) z = 0
    if (y == null) y = 0
    return Multiply(this,Translate(x, y, z))
  }

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

  scale(x, y, z){
    if (y == null) y = x;
    if (z == null) z = x;
    return Multiply(this,Scale(x, y, z))
  }

  /**
   * The rotate method returns a new matrix which is this matrix post multiplied
   * by each of 3 rotation matrices about the major axes, first X, then Y, then Z.
   * If the y and z components are undefined, the x value is used to rotate the
   * object about the z axis, as though the vector (0,0,x) were passed. All
   * rotation values are in degrees. This matrix is not modified.
   *
   * @param {number} rx The X component of the rotation value, or the Z component if the rotateY and rotateZ parameters are undefined.
   * @param {number=} ry The (optional) Y component of the rotation value.
   * @param {number=} rz The (optional) Z component of the rotation value.
   * @return {CSSMatrix} The result matrix
   */

  rotate(rx, ry, rz){
    if (ry == null) ry = 0;
    if (rz == null) {rz = rx; rx = 0}
    return Multiply(this,Rotate(rx, ry, rz))
  }

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

  rotateAxisAngle(x, y, z, angle){
    if (arguments.length!==4){
      console.error(`CSSMatrix: expecting 4 values`)
      return this
    }
    return Multiply(this,RotateAxisAngle(x, y, z, angle))
  }

  /**
   * Specifies a skew transformation along the `x-axis` by the given angle.
   * This matrix is not modified.
   *
   * @param {number} angle The angle amount in degrees to skew.
   * @return {CSSMatrix} The `CSSMatrix` result
   */

  skewX(angle){
    return Multiply(this,SkewX(angle))
  }

  /**
   * Specifies a skew transformation along the `y-axis` by the given angle.
   * This matrix is not modified.
   *
   * @param {number} angle The angle amount in degrees to skew.
   * @return {CSSMatrix} The `CSSMatrix` result
   */

  skewY(angle){
    return Multiply(this,SkewY(angle))
  }

  /**
   * Set the current `CSSMatrix` instance to the identity form and returns it.
   *
   * @return {CSSMatrix} this `CSSMatrix` instance
   */
  setIdentity(){
    let identity = [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
    return feedFromArray(this,identity)
  }

  /**
   * A `Boolean` whose value is `true` if the matrix is the identity matrix. The identity 
   * matrix is one in which every value is 0 except those on the main diagonal from top-left 
   * to bottom-right corner (in other words, where the offsets in each direction are equal).
   *
   * @return {Boolean} `Boolean` the current property value
   */
  get isIdentity(){
    let m = this;
    return (m.m11 == 1 && m.m12 == 0 && m.m13 == 0 && m.m14 == 0 &&
            m.m21 == 0 && m.m22 == 1 && m.m23 == 0 && m.m24 == 0 &&
            m.m31 == 0 && m.m32 == 0 && m.m33 == 1 && m.m34 == 0 &&
            m.m41 == 0 && m.m42 == 0 && m.m43 == 0 && m.m44 == 1)
  }

  /**
   * Sets a new `Boolean` flag value for `this.isIdentity` matrix property.
   *
   * @param {Boolean} value sets a new `Boolean` flag for this property
   */
  set isIdentity(value){
    this.isIdentity = value
  }

  /**
   * A `Boolean` flag whose value is `true` if the matrix was initialized as a 2D matrix 
   * and `false` if the matrix is 3D.
   *
   * @return {Boolean} `Boolean` the current property value
   */
  get is2D(){
    let m = this;
    return (m.m31 == 0 && m.m32 == 0 && m.m33 == 1 && m.m34 == 0 && m.m43 == 0 && m.m44 == 1)
  }

  /**
   * Sets a new `Boolean` flag value for `this.is2D` matrix property.
   *
   * @param {Boolean} value sets a new `Boolean` flag for this property
   */
  set is2D(value){
    this.is2D = value
  }	

  /**
   * Transforms the specified point using the matrix, returning a new 
   * `DOMPoint` like *Object* containing the transformed point. 
   * Neither the matrix nor the original point are altered.
   *
   * The method is equivalent with `transformPoint()` method 
   * of the `DOMMatrix` constructor.
   *  
   * JavaScript implementation by thednp
   * 
   * @param {Tuple} vector the *Object* with `x`, `y`, `z` and `w` properties
   * @return {Tuple} a new `{x,y,z,w}` *Object*
   */
  transformPoint(v){
    let _m = this, m = Translate(v.x, v.y, v.z)

    m.m44 = v.w || 1
    m = _m.multiply(m)

    return {
      x: m.m41,
      y: m.m42,
      z: m.m43,
      w: m.m44
    }
  }	
}

// export Transform Functions and static methods to global
CSSMatrix.Translate = Translate
CSSMatrix.Rotate = Rotate
CSSMatrix.RotateAxisAngle = RotateAxisAngle
CSSMatrix.Scale = Scale
CSSMatrix.SkewX = SkewX
CSSMatrix.SkewY = SkewY
CSSMatrix.Multiply = Multiply
CSSMatrix.fromMatrix = fromMatrix
CSSMatrix.fromArray = fromArray
CSSMatrix.feedFromArray = feedFromArray