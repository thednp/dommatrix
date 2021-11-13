declare module "index" {
    export default CSSMatrix;
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
        constructor(...args: any[]);
        /**
         * Sets a new `Boolean` flag value for `this.isIdentity` matrix property.
         *
         * @param {Boolean} value sets a new `Boolean` flag for this property
         */
        set isIdentity(arg: boolean);
        /**
         * A `Boolean` whose value is `true` if the matrix is the identity matrix. The identity
         * matrix is one in which every value is 0 except those on the main diagonal from top-left
         * to bottom-right corner (in other words, where the offsets in each direction are equal).
         *
         * @return {Boolean} `Boolean` the current property value
         */
        get isIdentity(): boolean;
        /**
         * Sets a new `Boolean` flag value for `this.is2D` matrix property.
         *
         * @param {Boolean} value sets a new `Boolean` flag for this property
         */
        set is2D(arg: boolean);
        /**
         * A `Boolean` flag whose value is `true` if the matrix was initialized as a 2D matrix
         * and `false` if the matrix is 3D.
         *
         * @return {Boolean} `Boolean` the current property value
         */
        get is2D(): boolean;
    }
    namespace CSSMatrix {
        export { Translate };
        export { Rotate };
        export { RotateAxisAngle };
        export { Scale };
        export { SkewX };
        export { SkewY };
        export { Multiply };
        export { fromMatrix };
        export { fromArray };
        export { feedFromArray };
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
     */
    function Translate(x: number, y: number, z: number): CSSMatrix;
    /**
     * Creates a new `CSSMatrix` for the rotation matrix and returns it.
     *
     * http://en.wikipedia.org/wiki/Rotation_matrix
     *
     * @param {Number} rx the `x-axis` rotation.
     * @param {Number} ry the `y-axis` rotation.
     * @param {Number} rz the `z-axis` rotation.
     */
    function Rotate(rx: number, ry: number, rz: number): CSSMatrix;
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
    function RotateAxisAngle(x: number, y: number, z: number, angle: number): CSSMatrix;
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
    function Scale(x: number, y: number, z: number): CSSMatrix;
    /**
     * Creates a new `CSSMatrix` for the shear of the `x-axis` rotation matrix and
     * returns it. This method is equivalent to the CSS `skewX()` function.
     *
     * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/skewX
     *
     * @param {Number} angle the angle in degrees.
     */
    function SkewX(angle: number): CSSMatrix;
    /**
     * Creates a new `CSSMatrix` for the shear of the `y-axis` rotation matrix and
     * returns it. This method is equivalent to the CSS `skewY()` function.
     *
     * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/skewY
     *
     * @param {Number} angle the angle in degrees.
     */
    function SkewY(angle: number): CSSMatrix;
    /**
     * Creates a new `CSSMatrix` resulted from the multiplication of two matrixes
     * and returns it. Both matrixes are not changed.
     *
     * @param {CSSMatrix} m1 the first matrix.
     * @param {CSSMatrix} m2 the second matrix.
     */
    function Multiply(m1: CSSMatrix, m2: CSSMatrix): CSSMatrix;
    /**
     * Returns a new *Float32Array* containing all 16 elements which comprise the matrix.
     * The elements are stored into the array as single-precision floating-point numbers
     * in column-major (colexographical access access or "colex") order.
     *
     * @return {Float32Array} matrix elements (m11, m21, m31, m41, ..)
     */
    /**
     * Returns a new Float64Array containing all 16 elements which comprise the matrix.
     * The elements are stored into the array as double-precision floating-point numbers
     * in column-major (colexographical access access or "colex") order.
     *
     * @return {Float64Array} matrix elements (m11, m21, m31, m41, ..)
     */
    /**
     * Creates a new mutable `CSSMatrix` object given an existing matrix or a
     * `DOMMatrix` *Object* which provides the values for its properties.
     *
     * @param {CSSMatrix} CSSMatrix the source `CSSMatrix` initialization to feed values from
     */
    function fromMatrix(m: any): CSSMatrix;
    /**
     * Creates a new mutable `CSSMatrix` object given an array float values.
     *
     * If the array has six values, the result is a 2D matrix; if the array has 16 values,
     * the result is a 3D matrix. Otherwise, a TypeError exception is thrown.
     *
     * @param {Array} array The source `Array` to feed values from.
     * @return {CSSMatrix} a The source array to feed values from.
     */
    function fromArray(a: any): CSSMatrix;
    /**
     * Feed a CSSMatrix object with the values of a 6/16 values array and returns it.
     *
     * @param {Array} array The source `Array` to feed values from.
     * @return {CSSMatrix} a The source array to feed values from.
     */
    function feedFromArray(m: any, array: any[]): CSSMatrix;
}
