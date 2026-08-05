//#region src/types.d.ts
/** A DOMPoint compatible Tuple. */
interface PointTuple {
  /** The X coordinate of the point. */
  x: number;
  /** The Y coordinate of the point. */
  y: number;
  /** The Z coordinate of the point. */
  z: number;
  /** The perspective divide component of the point. */
  w: number;
}
/** The result of **CSSMatrix.toJSON()** / **DOMMatrix.toJSON()** instance calls. */
interface JSONMatrix {
  /** The first element of the first row, alias of `a`. */
  m11: number;
  /** The second element of the first row, alias of `b`. */
  m12: number;
  /** The third element of the first row. */
  m13: number;
  /** The fourth element of the first row. */
  m14: number;
  /** The first element of the second row, alias of `c`. */
  m21: number;
  /** The second element of the second row, alias of `d`. */
  m22: number;
  /** The third element of the second row. */
  m23: number;
  /** The fourth element of the second row. */
  m24: number;
  /** The first element of the third row. */
  m31: number;
  /** The second element of the third row. */
  m32: number;
  /** The third element of the third row. */
  m33: number;
  /** The fourth element of the third row. */
  m34: number;
  /** The first element of the fourth row, alias of `e`. */
  m41: number;
  /** The second element of the fourth row, alias of `f`. */
  m42: number;
  /** The third element of the fourth row. */
  m43: number;
  /** The fourth element of the fourth row. */
  m44: number;
  /** The first element of the first row, alias of `m11`. */
  a: number;
  /** The second element of the first row, alias of `m12`. */
  b: number;
  /** The first element of the second row, alias of `m21`. */
  c: number;
  /** The second element of the second row, alias of `m22`. */
  d: number;
  /** The first element of the fourth row, alias of `m41`. */
  e: number;
  /** The second element of the fourth row, alias of `m42`. */
  f: number;
  /** A boolean flag indicating whether the matrix is 2D. */
  is2D: boolean;
  /** A boolean flag indicating whether the matrix is the identity matrix. */
  isIdentity: boolean;
}
/** An array of 6 numbers representing a 2D matrix. */
type Matrix = [number, number, number, number, number, number];
/** An array of 16 numbers representing a 3D matrix. */
type Matrix3d = [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number];
/** All CSSMatrix compatible initialization values. */
type CSSMatrixInput = string | number[] | Matrix | Matrix3d | CSSMatrix | DOMMatrix | JSONMatrix | Float32Array | Float64Array;
//#endregion
//#region src/index.d.ts
/** Checks if an array is compatible with CSSMatrix */
declare const isCompatibleArray: (array?: unknown) => array is Matrix | Matrix3d | Float32Array | Float64Array;
/** Checks if an object is compatible with CSSMatrix */
declare const isCompatibleObject: (object?: unknown) => object is CSSMatrix | DOMMatrix | JSONMatrix;
/**
 * Creates a new mutable `CSSMatrix` instance given an array of 16/6 floating point values.
 * This static method invalidates arrays that contain non-number elements.
 *
 * If the array has six values, the result is a 2D matrix; if the array has 16 values,
 * the result is a 3D matrix. Otherwise, a TypeError exception is thrown.
 *
 * @param array an `Array` to feed values from.
 * @param target an optional matrix instance to write the values into; when omitted
 * a new matrix is returned. Used internally by `setMatrixValue` to mutate in place.
 * @return the resulted matrix.
 */
declare const fromArray: (array: number[] | Float32Array | Float64Array, target?: CSSMatrix) => CSSMatrix;
/**
 * Creates a new mutable `CSSMatrix` instance given an existing matrix or a
 * `DOMMatrix` instance which provides the values for its properties.
 *
 * @param m the source matrix to feed values from.
 * @param target an optional matrix instance to write the values into; when omitted
 * a new matrix is returned. Used internally by `setMatrixValue` to mutate in place.
 * @return the resulted matrix.
 */
declare const fromMatrix: (m: CSSMatrix | DOMMatrix | JSONMatrix, target?: CSSMatrix) => CSSMatrix;
/**
 * Creates a new mutable `CSSMatrix` given any valid CSS transform string,
 * or what we call `TransformList`:
 *
 * * `matrix(a, b, c, d, e, f)` - valid matrix() transform function
 * * `matrix3d(m11, m12, m13, ...m44)` - valid matrix3d() transform function
 * * `translate(tx, ty) rotateX(alpha)` - any valid transform function(s)
 *
 * @copyright thednp © 2021
 *
 * @param source valid CSS transform string syntax.
 * @return the resulted matrix.
 */
declare const fromString: (source: string) => CSSMatrix;
/**
 * Returns an *Array* containing elements which comprise the matrix.
 * The method can return either the 16 elements or the 6 elements
 * depending on the value of the `is2D` parameter.
 *
 * @param m the source matrix to feed values from.
 * @param is2D *Array* representation of the matrix
 * @return an *Array* representation of the matrix
 */
declare const toArray: (m: CSSMatrix | DOMMatrix | JSONMatrix, is2D?: boolean) => Matrix | Matrix3d;
/**
 * Creates a new `CSSMatrix` for the translation matrix and returns it.
 * This method is equivalent to the CSS `translate3d()` function.
 *
 * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/translate3d
 *
 * @param x the `x-axis` position.
 * @param y the `y-axis` position.
 * @param z the `z-axis` position.
 * @return the resulted matrix.
 */
declare const Translate: (x: number, y: number, z: number) => CSSMatrix;
/**
 * Creates a new `CSSMatrix` for the rotation matrix and returns it.
 *
 * http://en.wikipedia.org/wiki/Rotation_matrix
 *
 * @param rx the `x-axis` rotation.
 * @param ry the `y-axis` rotation.
 * @param rz the `z-axis` rotation.
 * @return the resulted matrix.
 */
declare const Rotate: (rx: number, ry: number, rz: number) => CSSMatrix;
/**
 * Creates a new `CSSMatrix` for the rotation matrix and returns it.
 * This method is equivalent to the CSS `rotate3d()` function.
 *
 * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/rotate3d
 *
 * @param x the `x-axis` vector length.
 * @param y the `y-axis` vector length.
 * @param z the `z-axis` vector length.
 * @param alpha the value in degrees of the rotation.
 * @return the resulted matrix.
 */
declare const RotateAxisAngle: (x?: number, y?: number, z?: number, alpha?: number) => CSSMatrix;
/**
 * Creates a new `CSSMatrix` for the scale matrix and returns it.
 * This method is equivalent to the CSS `scale3d()` function, except it doesn't
 * accept {x, y, z} transform origin parameters.
 *
 * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/scale3d
 *
 * @param x the `x-axis` scale.
 * @param y the `y-axis` scale.
 * @param z the `z-axis` scale.
 * @return the resulted matrix.
 */
declare const Scale: (x: number, y: number, z: number) => CSSMatrix;
/**
 * Creates a new `CSSMatrix` for the shear of both the `x-axis` and`y-axis`
 * matrix and returns it. This method is equivalent to the CSS `skew()` function.
 *
 * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/skew
 *
 * @param angleX the X-angle in degrees.
 * @param angleY the Y-angle in degrees.
 * @return the resulted matrix.
 */
declare const Skew: (angleX: number, angleY: number) => CSSMatrix;
/**
 * Creates a new `CSSMatrix` for the shear of the `x-axis` rotation matrix and
 * returns it. This method is equivalent to the CSS `skewX()` function.
 *
 * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/skewX
 *
 * @param angle the angle in degrees.
 * @return the resulted matrix.
 */
declare const SkewX: (angle: number) => CSSMatrix;
/**
 * Creates a new `CSSMatrix` for the shear of the `y-axis` rotation matrix and
 * returns it. This method is equivalent to the CSS `skewY()` function.
 *
 * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/skewY
 *
 * @param angle the angle in degrees.
 * @return the resulted matrix.
 */
declare const SkewY: (angle: number) => CSSMatrix;
/**
 * Creates a new `CSSMatrix` resulted from the multiplication of two matrixes
 * and returns it. Both matrixes are not changed.
 *
 * @param m1 the first matrix.
 * @param m2 the second matrix.
 * @return the resulted matrix.
 */
declare const Multiply: (m1: CSSMatrix | DOMMatrix | JSONMatrix, m2: CSSMatrix | DOMMatrix | JSONMatrix) => CSSMatrix;
/**
 * Creates and returns a new `DOMMatrix` compatible instance
 * with equivalent instance methods.
 *
 * @class CSSMatrix
 *
 * @author thednp <https://github.com/thednp>
 * @link homepage <https://thednp.github.io/dommatrix/>
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrix
 */
declare class CSSMatrix {
  /** The first element of the first row, alias of `a`. */
  m11: number;
  /** The second element of the first row, alias of `b`. */
  m12: number;
  /** The third element of the first row. */
  m13: number;
  /** The fourth element of the first row. */
  m14: number;
  /** The first element of the second row, alias of `c`. */
  m21: number;
  /** The second element of the second row, alias of `d`. */
  m22: number;
  /** The third element of the second row. */
  m23: number;
  /** The fourth element of the second row. */
  m24: number;
  /** The first element of the third row. */
  m31: number;
  /** The second element of the third row. */
  m32: number;
  /** The third element of the third row. */
  m33: number;
  /** The fourth element of the third row. */
  m34: number;
  /** The first element of the fourth row, alias of `e`. */
  m41: number;
  /** The second element of the fourth row, alias of `f`. */
  m42: number;
  /** The third element of the fourth row. */
  m43: number;
  /** The fourth element of the fourth row. */
  m44: number;
  /** The first element of the first row, alias of `m11`. */
  a: number;
  /** The second element of the first row, alias of `m12`. */
  b: number;
  /** The first element of the second row, alias of `m21`. */
  c: number;
  /** The second element of the second row, alias of `m22`. */
  d: number;
  /** The first element of the fourth row, alias of `m41`. */
  e: number;
  /** The second element of the fourth row, alias of `m42`. */
  f: number;
  /** Returns a new translation matrix. See the `Translate` helper. */
  static Translate: typeof Translate;
  /** Returns a new rotation matrix. See the `Rotate` helper. */
  static Rotate: typeof Rotate;
  /** Returns a new rotation matrix about a vector. See the `RotateAxisAngle` helper. */
  static RotateAxisAngle: typeof RotateAxisAngle;
  /** Returns a new scale matrix. See the `Scale` helper. */
  static Scale: typeof Scale;
  /** Returns a new skew-X matrix. See the `SkewX` helper. */
  static SkewX: typeof SkewX;
  /** Returns a new skew-Y matrix. See the `SkewY` helper. */
  static SkewY: typeof SkewY;
  /** Returns a new skew matrix. See the `Skew` helper. */
  static Skew: typeof Skew;
  /** Returns the multiplication of two matrices. See the `Multiply` helper. */
  static Multiply: typeof Multiply;
  /** Creates a new matrix from an array of 6/16 numbers. See the `fromArray` helper. */
  static fromArray: typeof fromArray;
  /** Creates a new matrix from an existing matrix or a JSON object. See the `fromMatrix` helper. */
  static fromMatrix: typeof fromMatrix;
  /** Creates a new matrix from a CSS transform string. See the `fromString` helper. */
  static fromString: typeof fromString;
  /** Returns an *Array* of 6/16 values from a compatible matrix. See the `toArray` helper. */
  static toArray: typeof toArray;
  /** Checks if a value is a compatible 6/16 number array. See the `isCompatibleArray` helper. */
  static isCompatibleArray: typeof isCompatibleArray;
  /** Checks if a value is a `CSSMatrix` / `DOMMatrix` / `JSONMatrix` object. See the `isCompatibleObject` helper. */
  static isCompatibleObject: typeof isCompatibleObject;
  /**
   * @constructor
   * @param init accepts all parameter configurations:
   * * valid CSS transform string,
   * * CSSMatrix/DOMMatrix instance,
   * * a 6/16 elements *Array*.
   */
  constructor(init?: CSSMatrixInput);
  /**
   * A `Boolean` whose value is `true` if the matrix is the identity matrix. The identity
   * matrix is one in which every value is 0 except those on the main diagonal from top-left
   * to bottom-right corner (in other words, where the offsets in each direction are equal).
   *
   * @return the current property value
   */
  get isIdentity(): boolean;
  /**
   * A `Boolean` flag whose value is `true` if the matrix was initialized as a 2D matrix
   * and `false` if the matrix is 3D.
   *
   * @return the current property value
   */
  get is2D(): boolean;
  /**
   * The `setMatrixValue` method replaces the existing matrix with one computed
   * in the browser. EG: `matrix(1,0.25,-0.25,1,0,0)`
   *
   * The method accepts any *Array* values, the result of
   * `DOMMatrix` instance method `toFloat64Array()` / `toFloat32Array()` calls
   * or `CSSMatrix` instance method `toArray()`.
   *
   * This method expects valid *matrix()* / *matrix3d()* string values, as well
   * as other transform functions like *translateX(10px)*.
   *
   * The matrix is mutated in place (the same instance is returned), matching
   * the behavior of the native `DOMMatrix.setMatrixValue()`.
   *
   * @param source
   * @return the current matrix instance
   */
  setMatrixValue(source?: CSSMatrixInput): CSSMatrix;
  /**
   * Returns a *Float32Array* containing elements which comprise the matrix.
   * The method can return either the 16 elements or the 6 elements
   * depending on the value of the `is2D` parameter.
   *
   * @param is2D *Array* representation of the matrix
   * @return an *Array* representation of the matrix
   */
  toFloat32Array(is2D?: boolean): Float32Array;
  /**
   * Returns a *Float64Array* containing elements which comprise the matrix.
   * The method can return either the 16 elements or the 6 elements
   * depending on the value of the `is2D` parameter.
   *
   * @param is2D *Array* representation of the matrix
   * @return an *Array* representation of the matrix
   */
  toFloat64Array(is2D?: boolean): Float64Array;
  /**
   * Creates and returns a string representation of the matrix in `CSS` matrix syntax,
   * using the appropriate `CSS` matrix notation.
   *
   * matrix3d *matrix3d(m11, m12, m13, m14, m21, ...)*
   * matrix *matrix(a, b, c, d, e, f)*
   *
   * @return a string representation of the matrix
   */
  toString(): string;
  /**
   * Returns a JSON representation of the `CSSMatrix` instance, a standard *Object*
   * that includes `{a,b,c,d,e,f}` and `{m11,m12,m13,..m44}` properties as well
   * as the `is2D` & `isIdentity` properties.
   *
   * The result can also be used as a second parameter for the `fromMatrix` static method
   * to load values into another matrix instance.
   *
   * @return an *Object* with all matrix values.
   */
  toJSON(): JSONMatrix;
  /**
   * The Multiply method returns a new CSSMatrix which is the result of this
   * matrix multiplied by the passed matrix, with the passed matrix to the right.
   * This matrix is not modified.
   *
   * @param m2 CSSMatrix
   * @return The resulted matrix.
   */
  multiply(m2: CSSMatrix | DOMMatrix | JSONMatrix): CSSMatrix;
  /**
   * The translate method returns a new matrix which is this matrix post
   * multiplied by a translation matrix containing the passed values. If the z
   * component is undefined, a 0 value is used in its place. This matrix is not
   * modified.
   *
   * @param x X component of the translation value.
   * @param y Y component of the translation value.
   * @param z Z component of the translation value.
   * @return The resulted matrix
   */
  translate(x: number, y?: number, z?: number): CSSMatrix;
  /**
   * The scale method returns a new matrix which is this matrix post multiplied by
   * a scale matrix containing the passed values. If the z component is undefined,
   * a 1 value is used in its place. If the y component is undefined, the x
   * component value is used in its place. This matrix is not modified.
   *
   * @param x The X component of the scale value.
   * @param y The Y component of the scale value.
   * @param z The Z component of the scale value.
   * @return The resulted matrix
   */
  scale(x: number, y?: number, z?: number): CSSMatrix;
  /**
   * The rotate method returns a new matrix which is this matrix post multiplied
   * by each of 3 rotation matrices about the major axes, first X, then Y, then Z.
   * If the y and z components are undefined, the x value is used to rotate the
   * object about the z axis, as though the vector (0,0,x) were passed. All
   * rotation values are in degrees. This matrix is not modified.
   *
   * @param rx The X component of the rotation, or Z if Y and Z are null.
   * @param ry The (optional) Y component of the rotation value.
   * @param rz The (optional) Z component of the rotation value.
   * @return The resulted matrix
   */
  rotate(rx: number, ry?: number, rz?: number): CSSMatrix;
  /**
   * The rotateAxisAngle method returns a new matrix which is this matrix post
   * multiplied by a rotation matrix with the given axis and `angle`. The right-hand
   * rule is used to determine the direction of rotation. All rotation values are
   * in degrees. This matrix is not modified.
   *
   * @param x The X component of the axis vector.
   * @param y The Y component of the axis vector.
   * @param z The Z component of the axis vector.
   * @param angle The angle of rotation about the axis vector, in degrees.
   * @return The resulted matrix
   */
  rotateAxisAngle(x?: number, y?: number, z?: number, angle?: number): CSSMatrix;
  /**
   * Specifies a skew transformation along the `x-axis` by the given angle.
   * This matrix is not modified.
   *
   * @param angle The angle amount in degrees to skew.
   * @return The resulted matrix
   */
  skewX(angle: number): CSSMatrix;
  /**
   * Specifies a skew transformation along the `y-axis` by the given angle.
   * This matrix is not modified.
   *
   * @param angle The angle amount in degrees to skew.
   * @return The resulted matrix
   */
  skewY(angle: number): CSSMatrix;
  /**
   * Specifies a skew transformation along both the `x-axis` and `y-axis`.
   * This matrix is not modified.
   *
   * @param angleX The X-angle amount in degrees to skew.
   * @param angleY The angle amount in degrees to skew.
   * @return The resulted matrix
   */
  skew(angleX: number, angleY: number): CSSMatrix;
  /**
   * Modifies the current matrix by post-multiplying it with another matrix.
   * This is the mutable version of multiply().
   *
   * @param m2 The matrix to multiply with
   * @return this matrix (modified)
   */
  multiplySelf(m2: CSSMatrix | DOMMatrix | JSONMatrix): this;
  /**
   * Modifies the current matrix by post-multiplying it with a translation matrix.
   * This is the mutable version of translate().
   *
   * @param x X component of the translation value.
   * @param y Y component of the translation value.
   * @param z Z component of the translation value.
   * @return this matrix (modified)
   */
  translateSelf(x: number, y?: number, z?: number): this;
  /**
   * Modifies the current matrix by post-multiplying it with a scale matrix.
   * This is the mutable version of scale().
   *
   * @param x The X component of the scale value.
   * @param y The Y component of the scale value.
   * @param z The Z component of the scale value.
   * @return this matrix (modified)
   */
  scaleSelf(x: number, y?: number, z?: number): this;
  /**
   * Modifies the current matrix by post-multiplying it with a rotation matrix.
   * This is the mutable version of rotate().
   *
   * @param rx The X component of the rotation, or Z if Y and Z are null.
   * @param ry The (optional) Y component of the rotation value.
   * @param rz The (optional) Z component of the rotation value.
   * @return this matrix (modified)
   */
  rotateSelf(rx: number, ry?: number, rz?: number): this;
  /**
   * Modifies the current matrix by post-multiplying it with a rotation matrix
   * with the given axis and angle.
   * This is the mutable version of rotateAxisAngle().
   *
   * @param x The X component of the axis vector.
   * @param y The Y component of the axis vector.
   * @param z The Z component of the axis vector.
   * @param angle The angle of rotation about the axis vector, in degrees.
   * @return this matrix (modified)
   */
  rotateAxisAngleSelf(x?: number, y?: number, z?: number, angle?: number): this;
  /**
   * Modifies the current matrix by post-multiplying it with a skewX matrix.
   * This is the mutable version of skewX().
   *
   * @param angle The angle amount in degrees to skew.
   * @return this matrix (modified)
   */
  skewXSelf(angle: number): this;
  /**
   * Modifies the current matrix by post-multiplying it with a skewY matrix.
   * This is the mutable version of skewY().
   *
   * @param angle The angle amount in degrees to skew.
   * @return this matrix (modified)
   */
  skewYSelf(angle: number): this;
  /**
   * Modifies the current matrix by post-multiplying it with a skew matrix.
   * This is the mutable version of skew().
   *
   * @param angleX The X-angle amount in degrees to skew.
   * @param angleY The Y-angle amount in degrees to skew.
   * @return this matrix (modified)
   */
  skewSelf(angleX: number, angleY: number): this;
  /**
   * Transforms a specified vector using the matrix, returning a new
   * {x,y,z,w} Tuple *Object* comprising the transformed vector.
   * Neither the matrix nor the original vector are altered.
   *
   * The method is equivalent with `transformPoint()` method
   * of the `DOMMatrix` constructor.
   *
   * @param t Tuple with `{x,y,z,w}` components
   * @return the resulting Tuple
   */
  transformPoint(t: PointTuple | DOMPoint): PointTuple | DOMPoint;
}
//#endregion
export { type CSSMatrixInput, type JSONMatrix, type Matrix, type Matrix3d, type PointTuple, CSSMatrix as default };
//# sourceMappingURL=dommatrix.d.ts.map