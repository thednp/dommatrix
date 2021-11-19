export default CSSMatrix;
/**
 * Creates and returns a new `DOMMatrix` compatible *Object*
 * with equivalent instance methods.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrix
 * https://github.com/thednp/DOMMatrix/
 */
declare class CSSMatrix {
    /**
     * @constructor
     * @param {any} args accepts all possible parameter configuration:
     * * Types: number[] | string | CSSMatrix | DOMMatrix | undefined
     * * valid CSS transform string,
     * * CSSMatrix/DOMMatrix instance
     * * a 6/16 elements *Array*
     */
    constructor(...args: any);
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;
    m11: number;
    m12: number;
    m13: number;
    m14: number;
    m21: number;
    m22: number;
    m23: number;
    m24: number;
    m31: number;
    m32: number;
    m33: number;
    m34: number;
    m41: number;
    m42: number;
    m43: number;
    m44: number;
    /**
     * Sets a new `Boolean` flag value for `this.isIdentity` matrix property.
     *
     * @param {Boolean} value sets a new flag for this property
     */
    set isIdentity(arg: boolean);
    /**
     * A `Boolean` whose value is `true` if the matrix is the identity matrix. The identity
     * matrix is one in which every value is 0 except those on the main diagonal from top-left
     * to bottom-right corner (in other words, where the offsets in each direction are equal).
     *
     * @return {Boolean} the current property value
     */
    get isIdentity(): boolean;
    /**
     * Sets a new `Boolean` flag value for `this.is2D` matrix property.
     *
     * @param {Boolean} value sets a new flag for this property
     */
    set is2D(arg: boolean);
    /**
     * A `Boolean` flag whose value is `true` if the matrix was initialized as a 2D matrix
     * and `false` if the matrix is 3D.
     *
     * @return {Boolean} the current property value
     */
    get is2D(): boolean;
    /**
     * The `setMatrixValue` method replaces the existing matrix with one computed
     * in the browser. EG: `matrix(1,0.25,-0.25,1,0,0)`
     *
     * The method accepts any *Array* values, the result of
     * `DOMMatrix` instance method `toFloat64Array()` / `toFloat32Array()` calls
     *  or `CSSMatrix` instance method `toArray()`.
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
    setMatrixValue(source: string[] | number[] | string | CSSMatrix | DOMMatrix): CSSMatrix;
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
    toString(): string;
    /**
     * Returns an *Array* containing all 16 elements which comprise the matrix.
     * The method can return either the elements.
     *
     * Other methods make use of this method to feed their output values from this matrix.
     *
     * @return {Number[]} an *Array* representation of the matrix
     */
    toArray(): number[];
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
    toJSON(): Object;
    /**
     * The Multiply method returns a new CSSMatrix which is the result of this
     * matrix multiplied by the passed matrix, with the passed matrix to the right.
     * This matrix is not modified.
     *
     * @param {CSSMatrix} m2 CSSMatrix
     * @return {CSSMatrix} The result matrix.
     */
    multiply(m2: CSSMatrix): CSSMatrix;
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
    translate(x: number, y: number, z: number): CSSMatrix;
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
    scale(x: number, y: number, z: number): CSSMatrix;
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
    rotate(rx: number, ry: number, rz: number): CSSMatrix;
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
    rotateAxisAngle(x: number, y: number, z: number, angle: number, ...args: any[]): CSSMatrix;
    /**
     * Specifies a skew transformation along the `x-axis` by the given angle.
     * This matrix is not modified.
     *
     * @param {number} angle The angle amount in degrees to skew.
     * @return {CSSMatrix} The `CSSMatrix` result
     */
    skewX(angle: number): CSSMatrix;
    /**
     * Specifies a skew transformation along the `y-axis` by the given angle.
     * This matrix is not modified.
     *
     * @param {number} angle The angle amount in degrees to skew.
     * @return {CSSMatrix} The `CSSMatrix` result
     */
    skewY(angle: number): CSSMatrix;
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
    transformPoint(v: {
        x: number;
        y: number;
        z: number;
        w: number;
    }): {
        x: number;
        y: number;
        z: number;
        w: number;
    };
    /**
     * Transforms the specified vector using the matrix, returning a new
     * {x,y,z,w} Tuple *Object* comprising the transformed vector.
     * Neither the matrix nor the original vector are altered.
     *
     * @param {{x: number, y: number, z: number, w: number}} t Tuple with `{x,y,z,w}` components
     * @return {{x: number, y: number, z: number, w: number}} the resulting Tuple
     */
    transform(t: {
        x: number;
        y: number;
        z: number;
        w: number;
    }): {
        x: number;
        y: number;
        z: number;
        w: number;
    };
}
declare namespace CSSMatrix {
    export { Translate };
    export { Rotate };
    export { RotateAxisAngle };
    export { Scale };
    export { SkewX };
    export { SkewY };
    export { Multiply };
    export { fromArray };
    export { fromMatrix };
    export { fromString };
}
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
declare function Translate(x: number, y: number, z: number): CSSMatrix;
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
declare function Rotate(rx: number, ry: number, rz: number): CSSMatrix;
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
declare function RotateAxisAngle(x: number, y: number, z: number, alpha: number): CSSMatrix;
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
declare function Scale(x: number, y: number, z: number): CSSMatrix;
/**
 * Creates a new `CSSMatrix` for the shear of the `x-axis` rotation matrix and
 * returns it. This method is equivalent to the CSS `skewX()` function.
 *
 * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/skewX
 *
 * @param {Number} angle the angle in degrees.
 * @return {CSSMatrix} the resulted matrix.
 */
declare function SkewX(angle: number): CSSMatrix;
/**
 * Creates a new `CSSMatrix` for the shear of the `y-axis` rotation matrix and
 * returns it. This method is equivalent to the CSS `skewY()` function.
 *
 * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/skewY
 *
 * @param {Number} angle the angle in degrees.
 * @return {CSSMatrix} the resulted matrix.
 */
declare function SkewY(angle: number): CSSMatrix;
/**
 * Creates a new `CSSMatrix` resulted from the multiplication of two matrixes
 * and returns it. Both matrixes are not changed.
 *
 * @param {CSSMatrix} m1 the first matrix.
 * @param {CSSMatrix} m2 the second matrix.
 * @return {CSSMatrix} the resulted matrix.
 */
declare function Multiply(m1: CSSMatrix, m2: CSSMatrix): CSSMatrix;
/**
 * Creates a new mutable `CSSMatrix` object given an array float values.
 *
 * If the array has six values, the result is a 2D matrix; if the array has 16 values,
 * the result is a 3D matrix. Otherwise, a TypeError exception is thrown.
 *
 * @param {Number[]} array an `Array` to feed values from.
 * @return {CSSMatrix} the resulted matrix.
 */
declare function fromArray(array: number[]): CSSMatrix;
/**
 * Creates a new mutable `CSSMatrix` object given an existing matrix or a
 * `DOMMatrix` *Object* which provides the values for its properties.
 *
 * @param {CSSMatrix | DOMMatrix} m the source matrix to feed values from.
 * @return {CSSMatrix} the resulted matrix.
 */
declare function fromMatrix(m: CSSMatrix | DOMMatrix): CSSMatrix;
/**
 * Feed a CSSMatrix object with a valid CSS transform value.
 * * matrix(a, b, c, d, e, f) - valid matrix() transform function
 * * matrix3d(m11, m12, m13, ...m44) - valid matrix3d() transform function
 * * translate(tx, ty) rotateX(alpha) - any valid transform function(s)
 *
 * @param {string} source valid CSS transform string syntax.
 * @return {CSSMatrix} the resulted matrix.
 */
declare function fromString(source: string): CSSMatrix;
