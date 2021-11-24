declare module "version" {
    export default DMVersion;
    /**
     * A global namespace for library version.
     * @type {string}
     */
    const DMVersion: string;
}
declare module "dommatrix" {
    export default CSSMatrix;
    /**
     * Creates and returns a new `DOMMatrix` compatible *Object*
     * with equivalent instance methods.
     *
     * https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrix
     * https://github.com/thednp/DOMMatrix/
     */
    class CSSMatrix {
        /**
         * @constructor
         * @param {any} args accepts all parameter configurations:
         *
         * * valid CSS transform string,
         * * CSSMatrix/DOMMatrix instance,
         * * a 6/16 elements *Array*.
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
         * @param {string | number[] | CSSMatrix | DOMMatrix} source
         * @return {CSSMatrix} the matrix instance
         */
        setMatrixValue(source: string | number[] | CSSMatrix | DOMMatrix): CSSMatrix;
        /**
         * Creates and returns a string representation of the matrix in `CSS` matrix syntax,
         * using the appropriate `CSS` matrix notation.
         *
         * matrix3d *matrix3d(m11, m12, m13, m14, m21, ...)*
         * matrix *matrix(a, b, c, d, e, f)*
         *
         * @return {string} a string representation of the matrix
         */
        toString(): string;
        /**
         * Returns an *Array* containing all 16 elements which comprise the matrix.
         * The method can return either the elements.
         *
         * Other methods make use of this method to feed their output values from this matrix.
         *
         * @return {number[]} an *Array* representation of the matrix
         */
        toArray(): number[];
        /**
         * Returns a JSON representation of the `CSSMatrix` instance, a standard *Object*
         * that includes `{a,b,c,d,e,f}` and `{m11,m12,m13,..m44}` properties and
         * excludes `is2D` & `isIdentity` properties.
         *
         * The result can also be used as a second parameter for the `fromMatrix` static method
         * to load values into a matrix instance.
         *
         * @return {DMNS.jsonMatrix} an *Object* with all matrix values.
         */
        toJSON(): DMNS.jsonMatrix;
        /**
         * The Multiply method returns a new CSSMatrix which is the result of this
         * matrix multiplied by the passed matrix, with the passed matrix to the right.
         * This matrix is not modified.
         *
         * @param {CSSMatrix | DOMMatrix | DMNS.jsonMatrix} m2 CSSMatrix
         * @return {CSSMatrix} The resulted matrix.
         */
        multiply(m2: CSSMatrix | DOMMatrix | DMNS.jsonMatrix): CSSMatrix;
        /**
         * The translate method returns a new matrix which is this matrix post
         * multiplied by a translation matrix containing the passed values. If the z
         * component is undefined, a 0 value is used in its place. This matrix is not
         * modified.
         *
         * @param {number} x X component of the translation value.
         * @param {number | null} y Y component of the translation value.
         * @param {number | null} z Z component of the translation value.
         * @return {CSSMatrix} The resulted matrix
         */
        translate(x: number, y: number | null, z: number | null): CSSMatrix;
        /**
         * The scale method returns a new matrix which is this matrix post multiplied by
         * a scale matrix containing the passed values. If the z component is undefined,
         * a 1 value is used in its place. If the y component is undefined, the x
         * component value is used in its place. This matrix is not modified.
         *
         * @param {number} x The X component of the scale value.
         * @param {number | null} y The Y component of the scale value.
         * @param {number | null} z The Z component of the scale value.
         * @return {CSSMatrix} The resulted matrix
         */
        scale(x: number, y: number | null, z: number | null): CSSMatrix;
        /**
         * The rotate method returns a new matrix which is this matrix post multiplied
         * by each of 3 rotation matrices about the major axes, first X, then Y, then Z.
         * If the y and z components are undefined, the x value is used to rotate the
         * object about the z axis, as though the vector (0,0,x) were passed. All
         * rotation values are in degrees. This matrix is not modified.
         *
         * @param {number} rx The X component of the rotation, or Z if Y and Z are null.
         * @param {number | null} ry The (optional) Y component of the rotation value.
         * @param {number | null} rz The (optional) Z component of the rotation value.
         * @return {CSSMatrix} The resulted matrix
         */
        rotate(rx: number, ry: number | null, rz: number | null): CSSMatrix;
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
         * @return {CSSMatrix} The resulted matrix
         */
        rotateAxisAngle(x: number, y: number, z: number, angle: number): CSSMatrix;
        /**
         * Specifies a skew transformation along the `x-axis` by the given angle.
         * This matrix is not modified.
         *
         * @param {number} angle The angle amount in degrees to skew.
         * @return {CSSMatrix} The resulted matrix
         */
        skewX(angle: number): CSSMatrix;
        /**
         * Specifies a skew transformation along the `y-axis` by the given angle.
         * This matrix is not modified.
         *
         * @param {number} angle The angle amount in degrees to skew.
         * @return {CSSMatrix} The resulted matrix
         */
        skewY(angle: number): CSSMatrix;
        /**
         * Transforms a specified point using the matrix, returning a new
         * Tuple *Object* comprising of the transformed point.
         * Neither the matrix nor the original point are altered.
         *
         * The method is equivalent with `transformPoint()` method
         * of the `DOMMatrix` constructor.
         *
         * @copyright thednp © 2021
         *
         * @param {DMNS.PointTuple | DOMPoint} v Tuple or DOMPoint
         * @return {DMNS.PointTuple} the resulting Tuple
         */
        transformPoint(v: DMNS.PointTuple | DOMPoint): DMNS.PointTuple;
        /**
         * Transforms a specified vector using the matrix, returning a new
         * {x,y,z,w} Tuple *Object* comprising the transformed vector.
         * Neither the matrix nor the original vector are altered.
         *
         * @param {DMNS.PointTuple} t Tuple with `{x,y,z,w}` components
         * @return {DMNS.PointTuple} the resulting Tuple
         */
        transform(t: DMNS.PointTuple): DMNS.PointTuple;
    }
    namespace CSSMatrix {
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
        export { DMVersion as Version };
    }
    /**
     * Creates a new `CSSMatrix` for the translation matrix and returns it.
     * This method is equivalent to the CSS `translate3d()` function.
     *
     * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/translate3d
     *
     * @param {number} x the `x-axis` position.
     * @param {number} y the `y-axis` position.
     * @param {number} z the `z-axis` position.
     * @return {CSSMatrix} the resulted matrix.
     */
    function Translate(x: number, y: number, z: number): CSSMatrix;
    /**
     * Creates a new `CSSMatrix` for the rotation matrix and returns it.
     *
     * http://en.wikipedia.org/wiki/Rotation_matrix
     *
     * @param {number} rx the `x-axis` rotation.
     * @param {number} ry the `y-axis` rotation.
     * @param {number} rz the `z-axis` rotation.
     * @return {CSSMatrix} the resulted matrix.
     */
    function Rotate(rx: number, ry: number, rz: number): CSSMatrix;
    /**
     * Creates a new `CSSMatrix` for the rotation matrix and returns it.
     * This method is equivalent to the CSS `rotate3d()` function.
     *
     * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/rotate3d
     *
     * @param {number} x the `x-axis` vector length.
     * @param {number} y the `y-axis` vector length.
     * @param {number} z the `z-axis` vector length.
     * @param {number} alpha the value in degrees of the rotation.
     * @return {CSSMatrix} the resulted matrix.
     */
    function RotateAxisAngle(x: number, y: number, z: number, alpha: number): CSSMatrix;
    /**
     * Creates a new `CSSMatrix` for the scale matrix and returns it.
     * This method is equivalent to the CSS `scale3d()` function.
     *
     * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/scale3d
     *
     * @param {number} x the `x-axis` scale.
     * @param {number} y the `y-axis` scale.
     * @param {number} z the `z-axis` scale.
     * @return {CSSMatrix} the resulted matrix.
     */
    function Scale(x: number, y: number, z: number): CSSMatrix;
    /**
     * Creates a new `CSSMatrix` for the shear of the `x-axis` rotation matrix and
     * returns it. This method is equivalent to the CSS `skewX()` function.
     *
     * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/skewX
     *
     * @param {number} angle the angle in degrees.
     * @return {CSSMatrix} the resulted matrix.
     */
    function SkewX(angle: number): CSSMatrix;
    /**
     * Creates a new `CSSMatrix` for the shear of the `y-axis` rotation matrix and
     * returns it. This method is equivalent to the CSS `skewY()` function.
     *
     * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/skewY
     *
     * @param {number} angle the angle in degrees.
     * @return {CSSMatrix} the resulted matrix.
     */
    function SkewY(angle: number): CSSMatrix;
    /**
     * Creates a new `CSSMatrix` resulted from the multiplication of two matrixes
     * and returns it. Both matrixes are not changed.
     *
     * @param {CSSMatrix} m1 the first matrix.
     * @param {CSSMatrix} m2 the second matrix.
     * @return {CSSMatrix} the resulted matrix.
     */
    function Multiply(m1: CSSMatrix, m2: CSSMatrix): CSSMatrix;
    /**
     * Creates a new mutable `CSSMatrix` object given an array of floating point values.
     *
     * This static method invalidates arrays that contain non-number elements.
     *
     * If the array has six values, the result is a 2D matrix; if the array has 16 values,
     * the result is a 3D matrix. Otherwise, a TypeError exception is thrown.
     *
     * @param {number[]} array an `Array` to feed values from.
     * @return {CSSMatrix} the resulted matrix.
     */
    function fromArray(array: number[]): CSSMatrix;
    /**
     * Creates a new mutable `CSSMatrix` instance given an existing matrix or a
     * `DOMMatrix` instance which provides the values for its properties.
     *
     * @param {CSSMatrix | DOMMatrix | DMNS.jsonMatrix} m the source matrix to feed values from.
     * @return {CSSMatrix} the resulted matrix.
     */
    function fromMatrix(m: CSSMatrix | DOMMatrix | DMNS.jsonMatrix): CSSMatrix;
    /**
     * Creates a new mutable `CSSMatrix` instance given any valid CSS transform string.
     *
     * * `matrix(a, b, c, d, e, f)` - valid matrix() transform function
     * * `matrix3d(m11, m12, m13, ...m44)` - valid matrix3d() transform function
     * * `translate(tx, ty) rotateX(alpha)` - any valid transform function(s)
     *
     * @copyright thednp © 2021
     *
     * @param {string} source valid CSS transform string syntax.
     * @return {CSSMatrix} the resulted matrix.
     */
    function fromString(source: string): CSSMatrix;
    import DMVersion from "version";
}
declare module "index" {
    export default CSSMatrix;
    import CSSMatrix from "dommatrix";
}
