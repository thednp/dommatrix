(function(global, factory) {
	typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define([], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.CSSMatrix = factory());
})(this, function() {
	//#region src/index.ts
	/** The property names of a JSONMatrix, used for compatibility checks */
	const JSON_KEYS = Object.keys({
		a: 1,
		b: 0,
		c: 0,
		d: 1,
		e: 0,
		f: 0,
		m11: 1,
		m12: 0,
		m13: 0,
		m14: 0,
		m21: 0,
		m22: 1,
		m23: 0,
		m24: 0,
		m31: 0,
		m32: 0,
		m33: 1,
		m34: 0,
		m41: 0,
		m42: 0,
		m43: 0,
		m44: 1,
		is2D: true,
		isIdentity: true
	});
	/** Checks if an array is compatible with CSSMatrix */
	const isCompatibleArray = (array) => {
		return (array instanceof Float64Array || array instanceof Float32Array || Array.isArray(array) && array.every((x) => typeof x === "number")) && [6, 16].some((x) => array.length === x);
	};
	/** Checks if an object is compatible with CSSMatrix */
	const isCompatibleObject = (object) => {
		return typeof DOMMatrix !== "undefined" && object instanceof DOMMatrix || object instanceof CSSMatrix || typeof object === "object" && JSON_KEYS.every((k) => object && k in object);
	};
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
	const fromArray = (array, target) => {
		if (!isCompatibleArray(array)) throw TypeError(`CSSMatrix: "${Array.from(array).join(",")}" must be an array with 6/16 numbers.`);
		// istanbul ignore else @preserve
		if (array.length === 16) {
			const [m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44] = array;
			return writeValues(target ?? new CSSMatrix(), m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44);
		}
		const [M11, M12, M21, M22, M41, M42] = array;
		return writeValues(target ?? new CSSMatrix(), M11, M12, 0, 0, M21, M22, 0, 0, 0, 0, 1, 0, M41, M42, 0, 1);
	};
	/**
	* Internal helper that writes the 16 values of a matrix into a given `CSSMatrix`
	* instance. This is the single place where all 22 aliases (`a`-`f` and `m11`-`m44`)
	* are written, so every write path keeps the instance monomorphic.
	*
	* @param target the matrix instance to write the values into.
	* @param m11 the `m11` value.
	* @param m12 the `m12` value.
	* @param m13 the `m13` value.
	* @param m14 the `m14` value.
	* @param m21 the `m21` value.
	* @param m22 the `m22` value.
	* @param m23 the `m23` value.
	* @param m24 the `m24` value.
	* @param m31 the `m31` value.
	* @param m32 the `m32` value.
	* @param m33 the `m33` value.
	* @param m34 the `m34` value.
	* @param m41 the `m41` value.
	* @param m42 the `m42` value.
	* @param m43 the `m43` value.
	* @param m44 the `m44` value.
	* @return the target matrix.
	*/
	const writeValues = (target, m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) => {
		target.m11 = m11;
		target.a = m11;
		target.m21 = m21;
		target.c = m21;
		target.m31 = m31;
		target.m41 = m41;
		target.e = m41;
		target.m12 = m12;
		target.b = m12;
		target.m22 = m22;
		target.d = m22;
		target.m32 = m32;
		target.m42 = m42;
		target.f = m42;
		target.m13 = m13;
		target.m23 = m23;
		target.m33 = m33;
		target.m43 = m43;
		target.m14 = m14;
		target.m24 = m24;
		target.m34 = m34;
		target.m44 = m44;
		return target;
	};
	/**
	* Creates a new mutable `CSSMatrix` instance given the 16 values of the matrix.
	* This internal helper skips the validation and intermediate array steps of
	* `fromArray` and is used by the fast paths of the library.
	*
	* @param m11 the `m11` value.
	* @param m12 the `m12` value.
	* @param m13 the `m13` value.
	* @param m14 the `m14` value.
	* @param m21 the `m21` value.
	* @param m22 the `m22` value.
	* @param m23 the `m23` value.
	* @param m24 the `m24` value.
	* @param m31 the `m31` value.
	* @param m32 the `m32` value.
	* @param m33 the `m33` value.
	* @param m34 the `m34` value.
	* @param m41 the `m41` value.
	* @param m42 the `m42` value.
	* @param m43 the `m43` value.
	* @param m44 the `m44` value.
	* @return the resulted matrix.
	*/
	const fromValues = (m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) => {
		return writeValues(new CSSMatrix(), m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44);
	};
	/**
	* Creates a new mutable `CSSMatrix` instance given an existing matrix or a
	* `DOMMatrix` instance which provides the values for its properties.
	*
	* @param m the source matrix to feed values from.
	* @param target an optional matrix instance to write the values into; when omitted
	* a new matrix is returned. Used internally by `setMatrixValue` to mutate in place.
	* @return the resulted matrix.
	*/
	const fromMatrix = (m, target) => {
		if (isCompatibleObject(m)) return writeValues(target ?? new CSSMatrix(), m.m11, m.m12, m.m13, m.m14, m.m21, m.m22, m.m23, m.m24, m.m31, m.m32, m.m33, m.m34, m.m41, m.m42, m.m43, m.m44);
		throw TypeError(`CSSMatrix: "${JSON.stringify(m)}" is not a DOMMatrix / CSSMatrix / JSON compatible object.`);
	};
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
	const fromString = (source) => {
		if (typeof source !== "string") throw TypeError(`CSSMatrix: "${JSON.stringify(source)}" is not a string.`);
		const str = String(source).replace(/\s/g, "");
		const m = new CSSMatrix();
		const invalidStringError = `CSSMatrix: invalid transform string "${source}"`;
		const transformFn = /([\w-]+)\(([^)]*)\)/g;
		let consumed = 0;
		let match;
		while (match = transformFn.exec(str)) {
			const prop = match[1];
			const value = match[2];
			consumed += match[0].length;
			if (!value) throw TypeError(invalidStringError);
			const components = value.split(",").map((n) => n.includes("rad") ? parseFloat(n) * (180 / Math.PI) : parseFloat(n));
			const [x, y, z, a] = components;
			const xyz = [
				x,
				y,
				z
			];
			const xyza = [
				x,
				y,
				z,
				a
			];
			if (prop === "perspective" && x && [y, z].every((n) => n === void 0)) m.m34 = -1 / x;
			else if (prop.includes("matrix") && [6, 16].includes(components.length) && components.every((n) => !Number.isNaN(+n))) {
				const values = components.map((n) => Math.abs(n) < 1e-6 ? 0 : n);
				m.multiplySelf(fromArray(values));
			} else if (prop === "translate3d" && xyz.every((n) => !Number.isNaN(+n))) m.translateSelf(x, y, z);
			else if (prop === "translate" && x && z === void 0) m.translateSelf(x, y || 0, 0);
			else if (prop === "rotate3d" && xyza.every((n) => !Number.isNaN(+n)) && a) m.rotateAxisAngleSelf(x, y, z, a);
			else if (prop === "rotate" && x && [y, z].every((n) => n === void 0)) m.rotateSelf(0, 0, x);
			else if (prop === "scale3d" && xyz.every((n) => !Number.isNaN(+n)) && xyz.some((n) => n !== 1)) m.scaleSelf(x, y, z);
			else if (prop === "scale" && !Number.isNaN(x) && (x !== 1 || y !== 1) && z === void 0) {
				const sy = Number.isNaN(+y) ? x : y;
				m.scaleSelf(x, sy, 1);
			} else if (prop === "skew" && (x || !Number.isNaN(x) && y) && z === void 0) m.skewSelf(x, y || 0);
			else if ([
				"translate",
				"rotate",
				"scale",
				"skew"
			].some((p) => prop.includes(p)) && /[XYZ]/.test(prop) && x && [y, z].every((n) => n === void 0)) {
				if ("skewX" === prop || "skewY" === prop) m["skewX" === prop ? "skewXSelf" : "skewYSelf"](x);
				else {
					const fn = prop.replace(/[XYZ]/, "");
					const axis = prop.replace(fn, "");
					const idx = [
						"X",
						"Y",
						"Z"
					].indexOf(axis);
					const def = fn === "scale" ? 1 : 0;
					const method = fn + "Self";
					const axeValues = [
						idx === 0 ? x : def,
						idx === 1 ? x : def,
						idx === 2 ? x : def
					];
					m[method](...axeValues);
				}
			} else throw TypeError(invalidStringError);
		}
		if (consumed !== str.length) throw TypeError(invalidStringError);
		return m;
	};
	/**
	* Returns an *Array* containing elements which comprise the matrix.
	* The method can return either the 16 elements or the 6 elements
	* depending on the value of the `is2D` parameter.
	*
	* @param m the source matrix to feed values from.
	* @param is2D *Array* representation of the matrix
	* @return an *Array* representation of the matrix
	*/
	const toArray = (m, is2D) => {
		if (is2D) return [
			m.a,
			m.b,
			m.c,
			m.d,
			m.e,
			m.f
		];
		return [
			m.m11,
			m.m12,
			m.m13,
			m.m14,
			m.m21,
			m.m22,
			m.m23,
			m.m24,
			m.m31,
			m.m32,
			m.m33,
			m.m34,
			m.m41,
			m.m42,
			m.m43,
			m.m44
		];
	};
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
	const Translate = (x, y, z) => {
		const m = new CSSMatrix();
		m.m41 = x;
		m.e = x;
		m.m42 = y;
		m.f = y;
		m.m43 = z;
		return m;
	};
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
	const Rotate = (rx, ry, rz) => {
		const m = new CSSMatrix();
		const degToRad = Math.PI / 180;
		const radX = rx * degToRad;
		const radY = ry * degToRad;
		const radZ = rz * degToRad;
		const cosx = Math.cos(radX);
		const sinx = -Math.sin(radX);
		const cosy = Math.cos(radY);
		const siny = -Math.sin(radY);
		const cosz = Math.cos(radZ);
		const sinz = -Math.sin(radZ);
		const m11 = cosy * cosz;
		const m12 = -cosy * sinz;
		m.m11 = m11;
		m.a = m11;
		m.m12 = m12;
		m.b = m12;
		m.m13 = siny;
		const m21 = sinx * siny * cosz + cosx * sinz;
		m.m21 = m21;
		m.c = m21;
		const m22 = cosx * cosz - sinx * siny * sinz;
		m.m22 = m22;
		m.d = m22;
		m.m23 = -sinx * cosy;
		m.m31 = sinx * sinz - cosx * siny * cosz;
		m.m32 = sinx * cosz + cosx * siny * sinz;
		m.m33 = cosx * cosy;
		return m;
	};
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
	const RotateAxisAngle = (x = 0, y = 0, z = 0, alpha = 0) => {
		const m = new CSSMatrix();
		const length = Math.sqrt(x * x + y * y + z * z);
		if (length === 0) return m;
		const X = x / length;
		const Y = y / length;
		const Z = z / length;
		const angle = alpha * (Math.PI / 360);
		const sinA = Math.sin(angle);
		const cosA = Math.cos(angle);
		const sinA2 = sinA * sinA;
		const x2 = X * X;
		const y2 = Y * Y;
		const z2 = Z * Z;
		const m11 = 1 - 2 * (y2 + z2) * sinA2;
		m.m11 = m11;
		m.a = m11;
		const m12 = 2 * (X * Y * sinA2 + Z * sinA * cosA);
		m.m12 = m12;
		m.b = m12;
		m.m13 = 2 * (X * Z * sinA2 - Y * sinA * cosA);
		const m21 = 2 * (Y * X * sinA2 - Z * sinA * cosA);
		m.m21 = m21;
		m.c = m21;
		const m22 = 1 - 2 * (z2 + x2) * sinA2;
		m.m22 = m22;
		m.d = m22;
		m.m23 = 2 * (Y * Z * sinA2 + X * sinA * cosA);
		m.m31 = 2 * (Z * X * sinA2 + Y * sinA * cosA);
		m.m32 = 2 * (Z * Y * sinA2 - X * sinA * cosA);
		m.m33 = 1 - 2 * (x2 + y2) * sinA2;
		return m;
	};
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
	const Scale = (x, y, z) => {
		const m = new CSSMatrix();
		m.m11 = x;
		m.a = x;
		m.m22 = y;
		m.d = y;
		m.m33 = z;
		return m;
	};
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
	const Skew = (angleX, angleY) => {
		const m = new CSSMatrix();
		if (angleX) {
			const radX = angleX * Math.PI / 180;
			const tX = Math.tan(radX);
			m.m21 = tX;
			m.c = tX;
		}
		if (angleY) {
			const radY = angleY * Math.PI / 180;
			const tY = Math.tan(radY);
			m.m12 = tY;
			m.b = tY;
		}
		return m;
	};
	/**
	* Creates a new `CSSMatrix` for the shear of the `x-axis` rotation matrix and
	* returns it. This method is equivalent to the CSS `skewX()` function.
	*
	* https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/skewX
	*
	* @param angle the angle in degrees.
	* @return the resulted matrix.
	*/
	const SkewX = (angle) => {
		return Skew(angle, 0);
	};
	/**
	* Creates a new `CSSMatrix` for the shear of the `y-axis` rotation matrix and
	* returns it. This method is equivalent to the CSS `skewY()` function.
	*
	* https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/skewY
	*
	* @param angle the angle in degrees.
	* @return the resulted matrix.
	*/
	const SkewY = (angle) => {
		return Skew(0, angle);
	};
	/**
	* Computes the multiplication of two matrixes and stores the result into the
	* third matrix argument, which is also returned. Both source matrixes are
	* not changed.
	*
	* @param m1 the first matrix.
	* @param m2 the second matrix.
	* @param m the matrix to store the result into.
	* @return the resulted matrix.
	*/
	const multiplyInto = (m1, m2, m) => {
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
		return m;
	};
	/**
	* Creates a new `CSSMatrix` resulted from the multiplication of two matrixes
	* and returns it. Both matrixes are not changed.
	*
	* @param m1 the first matrix.
	* @param m2 the second matrix.
	* @return the resulted matrix.
	*/
	const Multiply = (m1, m2) => {
		return multiplyInto(m1, m2, new CSSMatrix());
	};
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
	var CSSMatrix = class {
		/** Returns a new translation matrix. See the `Translate` helper. */
		static Translate = Translate;
		/** Returns a new rotation matrix. See the `Rotate` helper. */
		static Rotate = Rotate;
		/** Returns a new rotation matrix about a vector. See the `RotateAxisAngle` helper. */
		static RotateAxisAngle = RotateAxisAngle;
		/** Returns a new scale matrix. See the `Scale` helper. */
		static Scale = Scale;
		/** Returns a new skew-X matrix. See the `SkewX` helper. */
		static SkewX = SkewX;
		/** Returns a new skew-Y matrix. See the `SkewY` helper. */
		static SkewY = SkewY;
		/** Returns a new skew matrix. See the `Skew` helper. */
		static Skew = Skew;
		/** Returns the multiplication of two matrices. See the `Multiply` helper. */
		static Multiply = Multiply;
		/** Creates a new matrix from an array of 6/16 numbers. See the `fromArray` helper. */
		static fromArray = fromArray;
		/** Creates a new matrix from an existing matrix or a JSON object. See the `fromMatrix` helper. */
		static fromMatrix = fromMatrix;
		/** Creates a new matrix from a CSS transform string. See the `fromString` helper. */
		static fromString = fromString;
		/** Returns an *Array* of 6/16 values from a compatible matrix. See the `toArray` helper. */
		static toArray = toArray;
		/** Checks if a value is a compatible 6/16 number array. See the `isCompatibleArray` helper. */
		static isCompatibleArray = isCompatibleArray;
		/** Checks if a value is a `CSSMatrix` / `DOMMatrix` / `JSONMatrix` object. See the `isCompatibleObject` helper. */
		static isCompatibleObject = isCompatibleObject;
		/**
		* @constructor
		* @param init accepts all parameter configurations:
		* * valid CSS transform string,
		* * CSSMatrix/DOMMatrix instance,
		* * a 6/16 elements *Array*.
		*/
		constructor(init) {
			if (init) {
				if (typeof init === "string" && init.length && init !== "none") return fromString(init);
				if (Array.isArray(init) || init instanceof Float64Array || init instanceof Float32Array) return fromArray(init);
				if (typeof init === "object") return fromMatrix(init);
			}
			this.a = 1;
			this.b = 0;
			this.c = 0;
			this.d = 1;
			this.e = 0;
			this.f = 0;
			this.m11 = 1;
			this.m12 = 0;
			this.m13 = 0;
			this.m14 = 0;
			this.m21 = 0;
			this.m22 = 1;
			this.m23 = 0;
			this.m24 = 0;
			this.m31 = 0;
			this.m32 = 0;
			this.m33 = 1;
			this.m34 = 0;
			this.m41 = 0;
			this.m42 = 0;
			this.m43 = 0;
			this.m44 = 1;
			return this;
		}
		/**
		* A `Boolean` whose value is `true` if the matrix is the identity matrix. The identity
		* matrix is one in which every value is 0 except those on the main diagonal from top-left
		* to bottom-right corner (in other words, where the offsets in each direction are equal).
		*
		* @return the current property value
		*/
		get isIdentity() {
			return this.m11 === 1 && this.m12 === 0 && this.m13 === 0 && this.m14 === 0 && this.m21 === 0 && this.m22 === 1 && this.m23 === 0 && this.m24 === 0 && this.m31 === 0 && this.m32 === 0 && this.m33 === 1 && this.m34 === 0 && this.m41 === 0 && this.m42 === 0 && this.m43 === 0 && this.m44 === 1;
		}
		/**
		* A `Boolean` flag whose value is `true` if the matrix was initialized as a 2D matrix
		* and `false` if the matrix is 3D.
		*
		* @return the current property value
		*/
		get is2D() {
			return this.m31 === 0 && this.m32 === 0 && this.m33 === 1 && this.m34 === 0 && this.m43 === 0 && this.m44 === 1;
		}
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
		setMatrixValue(source) {
			if (typeof source === "string" && source.length && source !== "none") {
				const m = fromString(source);
				return writeValues(this, m.m11, m.m12, m.m13, m.m14, m.m21, m.m22, m.m23, m.m24, m.m31, m.m32, m.m33, m.m34, m.m41, m.m42, m.m43, m.m44);
			}
			if (Array.isArray(source) || source instanceof Float64Array || source instanceof Float32Array) return fromArray(source, this);
			if (typeof source === "object") return fromMatrix(source, this);
			return this;
		}
		/**
		* Returns a *Float32Array* containing elements which comprise the matrix.
		* The method can return either the 16 elements or the 6 elements
		* depending on the value of the `is2D` parameter.
		*
		* @param is2D *Array* representation of the matrix
		* @return an *Array* representation of the matrix
		*/
		toFloat32Array(is2D) {
			return is2D ? new Float32Array([
				this.a,
				this.b,
				this.c,
				this.d,
				this.e,
				this.f
			]) : new Float32Array([
				this.m11,
				this.m12,
				this.m13,
				this.m14,
				this.m21,
				this.m22,
				this.m23,
				this.m24,
				this.m31,
				this.m32,
				this.m33,
				this.m34,
				this.m41,
				this.m42,
				this.m43,
				this.m44
			]);
		}
		/**
		* Returns a *Float64Array* containing elements which comprise the matrix.
		* The method can return either the 16 elements or the 6 elements
		* depending on the value of the `is2D` parameter.
		*
		* @param is2D *Array* representation of the matrix
		* @return an *Array* representation of the matrix
		*/
		toFloat64Array(is2D) {
			return is2D ? new Float64Array([
				this.a,
				this.b,
				this.c,
				this.d,
				this.e,
				this.f
			]) : new Float64Array([
				this.m11,
				this.m12,
				this.m13,
				this.m14,
				this.m21,
				this.m22,
				this.m23,
				this.m24,
				this.m31,
				this.m32,
				this.m33,
				this.m34,
				this.m41,
				this.m42,
				this.m43,
				this.m44
			]);
		}
		/**
		* Creates and returns a string representation of the matrix in `CSS` matrix syntax,
		* using the appropriate `CSS` matrix notation.
		*
		* matrix3d *matrix3d(m11, m12, m13, m14, m21, ...)*
		* matrix *matrix(a, b, c, d, e, f)*
		*
		* @return a string representation of the matrix
		*/
		toString() {
			const { is2D } = this;
			const values = this.toFloat64Array(is2D).join(", ");
			return `${is2D ? "matrix" : "matrix3d"}(${values})`;
		}
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
		toJSON() {
			const { is2D, isIdentity } = this;
			return {
				a: this.a,
				b: this.b,
				c: this.c,
				d: this.d,
				e: this.e,
				f: this.f,
				m11: this.m11,
				m12: this.m12,
				m13: this.m13,
				m14: this.m14,
				m21: this.m21,
				m22: this.m22,
				m23: this.m23,
				m24: this.m24,
				m31: this.m31,
				m32: this.m32,
				m33: this.m33,
				m34: this.m34,
				m41: this.m41,
				m42: this.m42,
				m43: this.m43,
				m44: this.m44,
				is2D,
				isIdentity
			};
		}
		/**
		* The Multiply method returns a new CSSMatrix which is the result of this
		* matrix multiplied by the passed matrix, with the passed matrix to the right.
		* This matrix is not modified.
		*
		* @param m2 CSSMatrix
		* @return The resulted matrix.
		*/
		multiply(m2) {
			return Multiply(this, m2);
		}
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
		translate(x, y, z) {
			const ty = y ?? 0;
			const tz = z ?? 0;
			const { m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44 } = this;
			const n41 = x * m11 + ty * m21 + tz * m31 + m41;
			const n42 = x * m12 + ty * m22 + tz * m32 + m42;
			const n43 = x * m13 + ty * m23 + tz * m33 + m43;
			const n44 = x * m14 + ty * m24 + tz * m34 + m44;
			return fromValues(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, n41, n42, n43, n44);
		}
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
		scale(x, y, z) {
			const sy = y ?? x;
			const sz = z ?? 1;
			const { m41, m42, m43, m44 } = this;
			return fromValues(this.m11 * x, this.m12 * x, this.m13 * x, this.m14 * x, this.m21 * sy, this.m22 * sy, this.m23 * sy, this.m24 * sy, this.m31 * sz, this.m32 * sz, this.m33 * sz, this.m34 * sz, m41, m42, m43, m44);
		}
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
		rotate(rx, ry, rz) {
			let RX = rx;
			let RY = ry || 0;
			let RZ = rz || 0;
			if (typeof rx === "number" && typeof ry === "undefined" && typeof rz === "undefined") {
				RZ = RX;
				RX = 0;
				RY = 0;
			}
			return this.multiply(Rotate(RX, RY, RZ));
		}
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
		rotateAxisAngle(x = 0, y = 0, z = 0, angle = 0) {
			if ([
				x,
				y,
				z,
				angle
			].some((n) => !Number.isFinite(n))) throw new TypeError("CSSMatrix: expecting 4 values");
			if (Math.sqrt(x * x + y * y + z * z) === 0) return fromMatrix(this);
			return this.multiply(RotateAxisAngle(x, y, z, angle));
		}
		/**
		* Specifies a skew transformation along the `x-axis` by the given angle.
		* This matrix is not modified.
		*
		* @param angle The angle amount in degrees to skew.
		* @return The resulted matrix
		*/
		skewX(angle) {
			return this.skew(angle, 0);
		}
		/**
		* Specifies a skew transformation along the `y-axis` by the given angle.
		* This matrix is not modified.
		*
		* @param angle The angle amount in degrees to skew.
		* @return The resulted matrix
		*/
		skewY(angle) {
			return this.skew(0, angle);
		}
		/**
		* Specifies a skew transformation along both the `x-axis` and `y-axis`.
		* This matrix is not modified.
		*
		* @param angleX The X-angle amount in degrees to skew.
		* @param angleY The angle amount in degrees to skew.
		* @return The resulted matrix
		*/
		skew(angleX, angleY) {
			const tX = angleX ? Math.tan(angleX * Math.PI / 180) : 0;
			const tY = angleY ? Math.tan(angleY * Math.PI / 180) : 0;
			const { m11, m12, m13, m14, m21, m22, m23, m24 } = this;
			return fromValues(m11 + tY * m21, m12 + tY * m22, m13 + tY * m23, m14 + tY * m24, tX * m11 + m21, tX * m12 + m22, tX * m13 + m23, tX * m14 + m24, this.m31, this.m32, this.m33, this.m34, this.m41, this.m42, this.m43, this.m44);
		}
		/**
		* Modifies the current matrix by post-multiplying it with another matrix.
		* This is the mutable version of multiply().
		*
		* @param m2 The matrix to multiply with
		* @return this matrix (modified)
		*/
		multiplySelf(m2) {
			multiplyInto(this, m2, this);
			return this;
		}
		/**
		* Modifies the current matrix by post-multiplying it with a translation matrix.
		* This is the mutable version of translate().
		*
		* @param x X component of the translation value.
		* @param y Y component of the translation value.
		* @param z Z component of the translation value.
		* @return this matrix (modified)
		*/
		translateSelf(x, y, z) {
			const ty = y ?? 0;
			const tz = z ?? 0;
			const { m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44 } = this;
			const n41 = x * m11 + ty * m21 + tz * m31 + m41;
			const n42 = x * m12 + ty * m22 + tz * m32 + m42;
			const n43 = x * m13 + ty * m23 + tz * m33 + m43;
			const n44 = x * m14 + ty * m24 + tz * m34 + m44;
			this.m41 = n41;
			this.e = n41;
			this.m42 = n42;
			this.f = n42;
			this.m43 = n43;
			this.m44 = n44;
			return this;
		}
		/**
		* Modifies the current matrix by post-multiplying it with a scale matrix.
		* This is the mutable version of scale().
		*
		* @param x The X component of the scale value.
		* @param y The Y component of the scale value.
		* @param z The Z component of the scale value.
		* @return this matrix (modified)
		*/
		scaleSelf(x, y, z) {
			const sy = y ?? x;
			const sz = z ?? 1;
			this.m11 *= x;
			this.a *= x;
			this.m12 *= x;
			this.b *= x;
			this.m13 *= x;
			this.m14 *= x;
			this.m21 *= sy;
			this.c *= sy;
			this.m22 *= sy;
			this.d *= sy;
			this.m23 *= sy;
			this.m24 *= sy;
			this.m31 *= sz;
			this.m32 *= sz;
			this.m33 *= sz;
			this.m34 *= sz;
			return this;
		}
		/**
		* Modifies the current matrix by post-multiplying it with a rotation matrix.
		* This is the mutable version of rotate().
		*
		* @param rx The X component of the rotation, or Z if Y and Z are null.
		* @param ry The (optional) Y component of the rotation value.
		* @param rz The (optional) Z component of the rotation value.
		* @return this matrix (modified)
		*/
		rotateSelf(rx, ry, rz) {
			let RX = rx;
			let RY = ry || 0;
			let RZ = rz || 0;
			if (typeof rx === "number" && typeof ry === "undefined" && typeof rz === "undefined") {
				RZ = RX;
				RX = 0;
				RY = 0;
			}
			return this.multiplySelf(Rotate(RX, RY, RZ));
		}
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
		rotateAxisAngleSelf(x = 0, y = 0, z = 0, angle = 0) {
			if ([
				x,
				y,
				z,
				angle
			].some((n) => !Number.isFinite(n))) throw new TypeError("CSSMatrix: expecting 4 values");
			if (Math.sqrt(x * x + y * y + z * z) === 0) return this;
			return this.multiplySelf(RotateAxisAngle(x, y, z, angle));
		}
		/**
		* Modifies the current matrix by post-multiplying it with a skewX matrix.
		* This is the mutable version of skewX().
		*
		* @param angle The angle amount in degrees to skew.
		* @return this matrix (modified)
		*/
		skewXSelf(angle) {
			return this.skewSelf(angle, 0);
		}
		/**
		* Modifies the current matrix by post-multiplying it with a skewY matrix.
		* This is the mutable version of skewY().
		*
		* @param angle The angle amount in degrees to skew.
		* @return this matrix (modified)
		*/
		skewYSelf(angle) {
			return this.skewSelf(0, angle);
		}
		/**
		* Modifies the current matrix by post-multiplying it with a skew matrix.
		* This is the mutable version of skew().
		*
		* @param angleX The X-angle amount in degrees to skew.
		* @param angleY The Y-angle amount in degrees to skew.
		* @return this matrix (modified)
		*/
		skewSelf(angleX, angleY) {
			const tX = angleX ? Math.tan(angleX * Math.PI / 180) : 0;
			const tY = angleY ? Math.tan(angleY * Math.PI / 180) : 0;
			const { m11, m12, m13, m14, m21, m22, m23, m24 } = this;
			const n11 = m11 + tY * m21;
			const n12 = m12 + tY * m22;
			const n13 = m13 + tY * m23;
			const n14 = m14 + tY * m24;
			const n21 = tX * m11 + m21;
			const n22 = tX * m12 + m22;
			const n23 = tX * m13 + m23;
			const n24 = tX * m14 + m24;
			this.m11 = n11;
			this.a = n11;
			this.m12 = n12;
			this.b = n12;
			this.m13 = n13;
			this.m14 = n14;
			this.m21 = n21;
			this.c = n21;
			this.m22 = n22;
			this.d = n22;
			this.m23 = n23;
			this.m24 = n24;
			return this;
		}
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
		transformPoint(t) {
			const x = this.m11 * t.x + this.m21 * t.y + this.m31 * t.z + this.m41 * t.w;
			const y = this.m12 * t.x + this.m22 * t.y + this.m32 * t.z + this.m42 * t.w;
			const z = this.m13 * t.x + this.m23 * t.y + this.m33 * t.z + this.m43 * t.w;
			const w = this.m14 * t.x + this.m24 * t.y + this.m34 * t.z + this.m44 * t.w;
			return typeof DOMPoint !== "undefined" && t instanceof DOMPoint ? new DOMPoint(x, y, z, w) : {
				x,
				y,
				z,
				w
			};
		}
	};
	//#endregion
	return CSSMatrix;
});

//# sourceMappingURL=dommatrix.js.map