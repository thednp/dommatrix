//#region src/index.ts
var e = {
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
	is2D: !0,
	isIdentity: !0
}, t = (e) => (e instanceof Float64Array || e instanceof Float32Array || Array.isArray(e) && e.every((e) => typeof e == "number")) && [6, 16].some((t) => e.length === t), n = (t) => t instanceof DOMMatrix || t instanceof h || typeof t == "object" && Object.keys(e).every((e) => t && e in t), r = (e) => {
	let n = new h(), r = Array.from(e);
	if (!t(r)) throw TypeError(`CSSMatrix: "${r.join(",")}" must be an array with 6/16 numbers.`);
	// istanbul ignore else @preserve
	if (r.length === 16) {
		let [e, t, i, a, o, s, c, l, u, d, f, p, m, h, g, _] = r;
		n.m11 = e, n.a = e, n.m21 = o, n.c = o, n.m31 = u, n.m41 = m, n.e = m, n.m12 = t, n.b = t, n.m22 = s, n.d = s, n.m32 = d, n.m42 = h, n.f = h, n.m13 = i, n.m23 = c, n.m33 = f, n.m43 = g, n.m14 = a, n.m24 = l, n.m34 = p, n.m44 = _;
	} else if (r.length === 6) {
		let [e, t, i, a, o, s] = r;
		n.m11 = e, n.a = e, n.m12 = t, n.b = t, n.m21 = i, n.c = i, n.m22 = a, n.d = a, n.m41 = o, n.e = o, n.m42 = s, n.f = s;
	}
	return n;
}, i = (e) => {
	if (n(e)) return r([
		e.m11,
		e.m12,
		e.m13,
		e.m14,
		e.m21,
		e.m22,
		e.m23,
		e.m24,
		e.m31,
		e.m32,
		e.m33,
		e.m34,
		e.m41,
		e.m42,
		e.m43,
		e.m44
	]);
	throw TypeError(`CSSMatrix: "${JSON.stringify(e)}" is not a DOMMatrix / CSSMatrix / JSON compatible object.`);
}, a = (e) => {
	if (typeof e != "string") throw TypeError(`CSSMatrix: "${JSON.stringify(e)}" is not a string.`);
	let t = String(e).replace(/\s/g, ""), n = new h(), i = `CSSMatrix: invalid transform string "${e}"`;
	return t.split(")").filter((e) => e).forEach((e) => {
		let [t, a] = e.split("(");
		if (!a) throw TypeError(i);
		let o = a.split(",").map((e) => e.includes("rad") ? 180 / Math.PI * parseFloat(e) : parseFloat(e)), [s, c, l, u] = o, d = [
			s,
			c,
			l
		], f = [
			s,
			c,
			l,
			u
		];
		if (t === "perspective" && s && [c, l].every((e) => e === void 0)) n.m34 = -1 / s;
		else if (t.includes("matrix") && [6, 16].includes(o.length) && o.every((e) => !Number.isNaN(+e))) {
			let e = o.map((e) => Math.abs(e) < 1e-6 ? 0 : e);
			n.multiplySelf(r(e));
		} else if (t === "translate3d" && d.every((e) => !Number.isNaN(+e))) n.translateSelf(s, c, l);
		else if (t === "translate" && s && l === void 0) n.translateSelf(s, c || 0, 0);
		else if (t === "rotate3d" && f.every((e) => !Number.isNaN(+e)) && u) n.rotateAxisAngleSelf(s, c, l, u);
		else if (t === "rotate" && s && [c, l].every((e) => e === void 0)) n.rotateSelf(0, 0, s);
		else if (t === "scale3d" && d.every((e) => !Number.isNaN(+e)) && d.some((e) => e !== 1)) n.scaleSelf(s, c, l);
		else if (t === "scale" && !Number.isNaN(s) && (s !== 1 || c !== 1) && l === void 0) {
			let e = Number.isNaN(+c) ? s : c;
			n.scaleSelf(s, e, 1);
		} else if (t === "skew" && (s || !Number.isNaN(s) && c) && l === void 0) n.skewSelf(s, c || 0);
		else if ([
			"translate",
			"rotate",
			"scale",
			"skew"
		].some((e) => t.includes(e)) && /[XYZ]/.test(t) && s && [c, l].every((e) => e === void 0)) if (t === "skewX" || t === "skewY") n[t === "skewX" ? "skewXSelf" : "skewYSelf"](s);
		else {
			let e = t.replace(/[XYZ]/, ""), r = t.replace(e, ""), i = [
				"X",
				"Y",
				"Z"
			].indexOf(r), a = e === "scale" ? 1 : 0, o = e + "Self", c = [
				i === 0 ? s : a,
				i === 1 ? s : a,
				i === 2 ? s : a
			];
			n[o](...c);
		}
		else throw TypeError(i);
	}), n;
}, o = (e, t) => t ? [
	e.a,
	e.b,
	e.c,
	e.d,
	e.e,
	e.f
] : [
	e.m11,
	e.m12,
	e.m13,
	e.m14,
	e.m21,
	e.m22,
	e.m23,
	e.m24,
	e.m31,
	e.m32,
	e.m33,
	e.m34,
	e.m41,
	e.m42,
	e.m43,
	e.m44
], s = (e, t, n) => {
	let r = new h();
	return r.m41 = e, r.e = e, r.m42 = t, r.f = t, r.m43 = n, r;
}, c = (e, t, n) => {
	let r = new h(), i = Math.PI / 180, a = e * i, o = t * i, s = n * i, c = Math.cos(a), l = -Math.sin(a), u = Math.cos(o), d = -Math.sin(o), f = Math.cos(s), p = -Math.sin(s), m = u * f, g = -u * p;
	r.m11 = m, r.a = m, r.m12 = g, r.b = g, r.m13 = d;
	let _ = l * d * f + c * p;
	r.m21 = _, r.c = _;
	let v = c * f - l * d * p;
	return r.m22 = v, r.d = v, r.m23 = -l * u, r.m31 = l * p - c * d * f, r.m32 = l * f + c * d * p, r.m33 = c * u, r;
}, l = (e = 0, t = 0, n = 0, r = 0) => {
	let i = new h(), a = Math.sqrt(e * e + t * t + n * n);
	if (a === 0) return i;
	let o = e / a, s = t / a, c = n / a, l = Math.PI / 360 * r, u = Math.sin(l), d = Math.cos(l), f = u * u, p = o * o, m = s * s, g = c * c, _ = 1 - 2 * (m + g) * f;
	i.m11 = _, i.a = _;
	let v = 2 * (o * s * f + c * u * d);
	i.m12 = v, i.b = v, i.m13 = 2 * (o * c * f - s * u * d);
	let y = 2 * (s * o * f - c * u * d);
	i.m21 = y, i.c = y;
	let b = 1 - 2 * (g + p) * f;
	return i.m22 = b, i.d = b, i.m23 = 2 * (s * c * f + o * u * d), i.m31 = 2 * (c * o * f + s * u * d), i.m32 = 2 * (c * s * f - o * u * d), i.m33 = 1 - 2 * (p + m) * f, i;
}, u = (e, t, n) => {
	let r = new h();
	return r.m11 = e, r.a = e, r.m22 = t, r.d = t, r.m33 = n, r;
}, d = (e, t) => {
	let n = new h();
	if (e) {
		let t = e * Math.PI / 180, r = Math.tan(t);
		n.m21 = r, n.c = r;
	}
	if (t) {
		let e = t * Math.PI / 180, r = Math.tan(e);
		n.m12 = r, n.b = r;
	}
	return n;
}, f = (e) => d(e, 0), p = (e) => d(0, e), m = (e, t) => r([
	t.m11 * e.m11 + t.m12 * e.m21 + t.m13 * e.m31 + t.m14 * e.m41,
	t.m11 * e.m12 + t.m12 * e.m22 + t.m13 * e.m32 + t.m14 * e.m42,
	t.m11 * e.m13 + t.m12 * e.m23 + t.m13 * e.m33 + t.m14 * e.m43,
	t.m11 * e.m14 + t.m12 * e.m24 + t.m13 * e.m34 + t.m14 * e.m44,
	t.m21 * e.m11 + t.m22 * e.m21 + t.m23 * e.m31 + t.m24 * e.m41,
	t.m21 * e.m12 + t.m22 * e.m22 + t.m23 * e.m32 + t.m24 * e.m42,
	t.m21 * e.m13 + t.m22 * e.m23 + t.m23 * e.m33 + t.m24 * e.m43,
	t.m21 * e.m14 + t.m22 * e.m24 + t.m23 * e.m34 + t.m24 * e.m44,
	t.m31 * e.m11 + t.m32 * e.m21 + t.m33 * e.m31 + t.m34 * e.m41,
	t.m31 * e.m12 + t.m32 * e.m22 + t.m33 * e.m32 + t.m34 * e.m42,
	t.m31 * e.m13 + t.m32 * e.m23 + t.m33 * e.m33 + t.m34 * e.m43,
	t.m31 * e.m14 + t.m32 * e.m24 + t.m33 * e.m34 + t.m34 * e.m44,
	t.m41 * e.m11 + t.m42 * e.m21 + t.m43 * e.m31 + t.m44 * e.m41,
	t.m41 * e.m12 + t.m42 * e.m22 + t.m43 * e.m32 + t.m44 * e.m42,
	t.m41 * e.m13 + t.m42 * e.m23 + t.m43 * e.m33 + t.m44 * e.m43,
	t.m41 * e.m14 + t.m42 * e.m24 + t.m43 * e.m34 + t.m44 * e.m44
]), h = class {
	static Translate = s;
	static Rotate = c;
	static RotateAxisAngle = l;
	static Scale = u;
	static SkewX = f;
	static SkewY = p;
	static Skew = d;
	static Multiply = m;
	static fromArray = r;
	static fromMatrix = i;
	static fromString = a;
	static toArray = o;
	static isCompatibleArray = t;
	static isCompatibleObject = n;
	constructor(e) {
		return this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.e = 0, this.f = 0, this.m11 = 1, this.m12 = 0, this.m13 = 0, this.m14 = 0, this.m21 = 0, this.m22 = 1, this.m23 = 0, this.m24 = 0, this.m31 = 0, this.m32 = 0, this.m33 = 1, this.m34 = 0, this.m41 = 0, this.m42 = 0, this.m43 = 0, this.m44 = 1, e ? this.setMatrixValue(e) : this;
	}
	get isIdentity() {
		return this.m11 === 1 && this.m12 === 0 && this.m13 === 0 && this.m14 === 0 && this.m21 === 0 && this.m22 === 1 && this.m23 === 0 && this.m24 === 0 && this.m31 === 0 && this.m32 === 0 && this.m33 === 1 && this.m34 === 0 && this.m41 === 0 && this.m42 === 0 && this.m43 === 0 && this.m44 === 1;
	}
	get is2D() {
		return this.m31 === 0 && this.m32 === 0 && this.m33 === 1 && this.m34 === 0 && this.m43 === 0 && this.m44 === 1;
	}
	setMatrixValue(e) {
		return typeof e == "string" && e.length && e !== "none" ? a(e) : Array.isArray(e) || e instanceof Float64Array || e instanceof Float32Array ? r(e) : typeof e == "object" ? i(e) : this;
	}
	toFloat32Array(e) {
		return Float32Array.from(o(this, e));
	}
	toFloat64Array(e) {
		return Float64Array.from(o(this, e));
	}
	toString() {
		let { is2D: e } = this, t = this.toFloat64Array(e).join(", ");
		return `${e ? "matrix" : "matrix3d"}(${t})`;
	}
	toJSON() {
		let { is2D: e, isIdentity: t } = this;
		return {
			...this,
			is2D: e,
			isIdentity: t
		};
	}
	multiply(e) {
		return m(this, e);
	}
	translate(e, t, n) {
		return this.multiply(s(e, t ?? 0, n ?? 0));
	}
	scale(e, t, n) {
		return this.multiply(u(e, t ?? e, n ?? 1));
	}
	rotate(e, t, n) {
		let r = e, i = t || 0, a = n || 0;
		return typeof e == "number" && t === void 0 && n === void 0 && (a = r, r = 0, i = 0), this.multiply(c(r, i, a));
	}
	rotateAxisAngle(e = 0, t = 0, n = 0, r = 0) {
		if ([
			e,
			t,
			n,
			r
		].some((e) => !Number.isFinite(e))) throw TypeError("CSSMatrix: expecting 4 values");
		return Math.sqrt(e * e + t * t + n * n) === 0 ? i(this) : this.multiply(l(e, t, n, r));
	}
	skewX(e) {
		return this.multiply(f(e));
	}
	skewY(e) {
		return this.multiply(p(e));
	}
	skew(e, t) {
		return this.multiply(d(e, t));
	}
	multiplySelf(e) {
		let t = m(this, e);
		return Object.assign(this, t), this;
	}
	translateSelf(e, t, n) {
		return this.multiplySelf(s(e, t ?? 0, n ?? 0));
	}
	scaleSelf(e, t, n) {
		return this.multiplySelf(u(e, t ?? e, n ?? 1));
	}
	rotateSelf(e, t, n) {
		let r = e, i = t || 0, a = n || 0;
		return typeof e == "number" && t === void 0 && n === void 0 && (a = r, r = 0, i = 0), this.multiplySelf(c(r, i, a));
	}
	rotateAxisAngleSelf(e = 0, t = 0, n = 0, r = 0) {
		if ([
			e,
			t,
			n,
			r
		].some((e) => !Number.isFinite(e))) throw TypeError("CSSMatrix: expecting 4 values");
		return Math.sqrt(e * e + t * t + n * n) === 0 ? this : this.multiplySelf(l(e, t, n, r));
	}
	skewXSelf(e) {
		return this.multiplySelf(f(e));
	}
	skewYSelf(e) {
		return this.multiplySelf(p(e));
	}
	skewSelf(e, t) {
		return this.multiplySelf(d(e, t));
	}
	transformPoint(e) {
		let t = this.m11 * e.x + this.m21 * e.y + this.m31 * e.z + this.m41 * e.w, n = this.m12 * e.x + this.m22 * e.y + this.m32 * e.z + this.m42 * e.w, r = this.m13 * e.x + this.m23 * e.y + this.m33 * e.z + this.m43 * e.w, i = this.m14 * e.x + this.m24 * e.y + this.m34 * e.z + this.m44 * e.w;
		return e instanceof DOMPoint ? new DOMPoint(t, n, r, i) : {
			x: t,
			y: n,
			z: r,
			w: i
		};
	}
};
//#endregion
export { h as default };

//# sourceMappingURL=dommatrix.mjs.map