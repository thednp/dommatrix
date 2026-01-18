const I = {
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
}, T = (s) => (s instanceof Float64Array || s instanceof Float32Array || Array.isArray(s) && s.every((t) => typeof t == "number")) && [6, 16].some((t) => s.length === t), E = (s) => s instanceof DOMMatrix || s instanceof M || typeof s == "object" && Object.keys(I).every((t) => s && t in s), b = (s) => {
  const t = new M(), e = Array.from(s);
  if (!T(e))
    throw TypeError(
      `CSSMatrix: "${e.join(",")}" must be an array with 6/16 numbers.`
    );
  if (e.length === 16) {
    const [
      i,
      n,
      m,
      a,
      h,
      r,
      l,
      c,
      u,
      f,
      p,
      o,
      y,
      S,
      d,
      w
    ] = e;
    t.m11 = i, t.a = i, t.m21 = h, t.c = h, t.m31 = u, t.m41 = y, t.e = y, t.m12 = n, t.b = n, t.m22 = r, t.d = r, t.m32 = f, t.m42 = S, t.f = S, t.m13 = m, t.m23 = l, t.m33 = p, t.m43 = d, t.m14 = a, t.m24 = c, t.m34 = o, t.m44 = w;
  } else if (e.length === 6) {
    const [i, n, m, a, h, r] = e;
    t.m11 = i, t.a = i, t.m12 = n, t.b = n, t.m21 = m, t.c = m, t.m22 = a, t.d = a, t.m41 = h, t.e = h, t.m42 = r, t.f = r;
  }
  return t;
}, N = (s) => {
  if (E(s))
    return b([
      s.m11,
      s.m12,
      s.m13,
      s.m14,
      s.m21,
      s.m22,
      s.m23,
      s.m24,
      s.m31,
      s.m32,
      s.m33,
      s.m34,
      s.m41,
      s.m42,
      s.m43,
      s.m44
    ]);
  throw TypeError(
    `CSSMatrix: "${JSON.stringify(
      s
    )}" is not a DOMMatrix / CSSMatrix / JSON compatible object.`
  );
}, R = (s) => {
  if (typeof s != "string")
    throw TypeError(`CSSMatrix: "${JSON.stringify(s)}" is not a string.`);
  const t = String(s).replace(/\s/g, ""), e = new M(), i = `CSSMatrix: invalid transform string "${s}"`;
  return t.split(")").filter((n) => n).forEach((n) => {
    const [m, a] = n.split("(");
    if (!a) throw TypeError(i);
    const h = a.split(",").map(
      (o) => o.includes("rad") ? parseFloat(o) * (180 / Math.PI) : parseFloat(o)
    ), [r, l, c, u] = h, f = [r, l, c], p = [r, l, c, u];
    if (m === "perspective" && r && [l, c].every((o) => o === void 0))
      e.m34 = -1 / r;
    else if (m.includes("matrix") && [6, 16].includes(h.length) && h.every((o) => !Number.isNaN(+o))) {
      const o = h.map((y) => Math.abs(y) < 1e-6 ? 0 : y);
      e.multiplySelf(b(o));
    } else if (m === "translate3d" && f.every((o) => !Number.isNaN(+o)))
      e.translateSelf(r, l, c);
    else if (m === "translate" && r && c === void 0)
      e.translateSelf(r, l || 0, 0);
    else if (m === "rotate3d" && p.every((o) => !Number.isNaN(+o)) && u)
      e.rotateAxisAngleSelf(r, l, c, u);
    else if (m === "rotate" && r && [l, c].every((o) => o === void 0))
      e.rotateSelf(0, 0, r);
    else if (m === "scale3d" && f.every((o) => !Number.isNaN(+o)) && f.some((o) => o !== 1))
      e.scaleSelf(r, l, c);
    else if (
      // prop === "scale" && !Number.isNaN(x) && x !== 1 && z === undefined
      // prop === "scale" && !Number.isNaN(x) && [x, y].some((n) => n !== 1) &&
      m === "scale" && !Number.isNaN(r) && (r !== 1 || l !== 1) && c === void 0
    ) {
      const y = Number.isNaN(+l) ? r : l;
      e.scaleSelf(r, y, 1);
    } else if (m === "skew" && (r || !Number.isNaN(r) && l) && c === void 0)
      e.skewSelf(r, l || 0);
    else if (["translate", "rotate", "scale", "skew"].some(
      (o) => m.includes(o)
    ) && /[XYZ]/.test(m) && r && [l, c].every((o) => o === void 0))
      if (m === "skewX" || m === "skewY")
        e[m === "skewX" ? "skewXSelf" : "skewYSelf"](r);
      else {
        const o = m.replace(/[XYZ]/, ""), y = m.replace(o, ""), S = ["X", "Y", "Z"].indexOf(y), d = o === "scale" ? 1 : 0, w = o + "Self", g = [
          S === 0 ? r : d,
          S === 1 ? r : d,
          S === 2 ? r : d
        ];
        e[w](...g);
      }
    else
      throw TypeError(i);
  }), e;
}, x = (s, t) => t ? [s.a, s.b, s.c, s.d, s.e, s.f] : [
  s.m11,
  s.m12,
  s.m13,
  s.m14,
  s.m21,
  s.m22,
  s.m23,
  s.m24,
  s.m31,
  s.m32,
  s.m33,
  s.m34,
  s.m41,
  s.m42,
  s.m43,
  s.m44
], v = (s, t, e) => {
  const i = new M();
  return i.m41 = s, i.e = s, i.m42 = t, i.f = t, i.m43 = e, i;
}, k = (s, t, e) => {
  const i = new M(), n = Math.PI / 180, m = s * n, a = t * n, h = e * n, r = Math.cos(m), l = -Math.sin(m), c = Math.cos(a), u = -Math.sin(a), f = Math.cos(h), p = -Math.sin(h), o = c * f, y = -c * p;
  i.m11 = o, i.a = o, i.m12 = y, i.b = y, i.m13 = u;
  const S = l * u * f + r * p;
  i.m21 = S, i.c = S;
  const d = r * f - l * u * p;
  return i.m22 = d, i.d = d, i.m23 = -l * c, i.m31 = l * p - r * u * f, i.m32 = l * f + r * u * p, i.m33 = r * c, i;
}, X = (s = 0, t = 0, e = 0, i = 0) => {
  const n = new M(), m = Math.sqrt(s * s + t * t + e * e);
  if (m === 0)
    return n;
  const a = s / m, h = t / m, r = e / m, l = i * (Math.PI / 360), c = Math.sin(l), u = Math.cos(l), f = c * c, p = a * a, o = h * h, y = r * r, S = 1 - 2 * (o + y) * f;
  n.m11 = S, n.a = S;
  const d = 2 * (a * h * f + r * c * u);
  n.m12 = d, n.b = d, n.m13 = 2 * (a * r * f - h * c * u);
  const w = 2 * (h * a * f - r * c * u);
  n.m21 = w, n.c = w;
  const g = 1 - 2 * (y + p) * f;
  return n.m22 = g, n.d = g, n.m23 = 2 * (h * r * f + a * c * u), n.m31 = 2 * (r * a * f + h * c * u), n.m32 = 2 * (r * h * f - a * c * u), n.m33 = 1 - 2 * (p + o) * f, n;
}, O = (s, t, e) => {
  const i = new M();
  return i.m11 = s, i.a = s, i.m22 = t, i.d = t, i.m33 = e, i;
}, A = (s, t) => {
  const e = new M();
  if (s) {
    const i = s * Math.PI / 180, n = Math.tan(i);
    e.m21 = n, e.c = n;
  }
  if (t) {
    const i = t * Math.PI / 180, n = Math.tan(i);
    e.m12 = n, e.b = n;
  }
  return e;
}, Y = (s) => A(s, 0), F = (s) => A(0, s), C = (s, t) => {
  const e = t.m11 * s.m11 + t.m12 * s.m21 + t.m13 * s.m31 + t.m14 * s.m41, i = t.m11 * s.m12 + t.m12 * s.m22 + t.m13 * s.m32 + t.m14 * s.m42, n = t.m11 * s.m13 + t.m12 * s.m23 + t.m13 * s.m33 + t.m14 * s.m43, m = t.m11 * s.m14 + t.m12 * s.m24 + t.m13 * s.m34 + t.m14 * s.m44, a = t.m21 * s.m11 + t.m22 * s.m21 + t.m23 * s.m31 + t.m24 * s.m41, h = t.m21 * s.m12 + t.m22 * s.m22 + t.m23 * s.m32 + t.m24 * s.m42, r = t.m21 * s.m13 + t.m22 * s.m23 + t.m23 * s.m33 + t.m24 * s.m43, l = t.m21 * s.m14 + t.m22 * s.m24 + t.m23 * s.m34 + t.m24 * s.m44, c = t.m31 * s.m11 + t.m32 * s.m21 + t.m33 * s.m31 + t.m34 * s.m41, u = t.m31 * s.m12 + t.m32 * s.m22 + t.m33 * s.m32 + t.m34 * s.m42, f = t.m31 * s.m13 + t.m32 * s.m23 + t.m33 * s.m33 + t.m34 * s.m43, p = t.m31 * s.m14 + t.m32 * s.m24 + t.m33 * s.m34 + t.m34 * s.m44, o = t.m41 * s.m11 + t.m42 * s.m21 + t.m43 * s.m31 + t.m44 * s.m41, y = t.m41 * s.m12 + t.m42 * s.m22 + t.m43 * s.m32 + t.m44 * s.m42, S = t.m41 * s.m13 + t.m42 * s.m23 + t.m43 * s.m33 + t.m44 * s.m43, d = t.m41 * s.m14 + t.m42 * s.m24 + t.m43 * s.m34 + t.m44 * s.m44;
  return b([
    e,
    i,
    n,
    m,
    a,
    h,
    r,
    l,
    c,
    u,
    f,
    p,
    o,
    y,
    S,
    d
  ]);
};
class M {
  static Translate = v;
  static Rotate = k;
  static RotateAxisAngle = X;
  static Scale = O;
  static SkewX = Y;
  static SkewY = F;
  static Skew = A;
  static Multiply = C;
  static fromArray = b;
  static fromMatrix = N;
  static fromString = R;
  static toArray = x;
  static isCompatibleArray = T;
  static isCompatibleObject = E;
  /**
   * @constructor
   * @param init accepts all parameter configurations:
   * * valid CSS transform string,
   * * CSSMatrix/DOMMatrix instance,
   * * a 6/16 elements *Array*.
   */
  constructor(t) {
    return this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.e = 0, this.f = 0, this.m11 = 1, this.m12 = 0, this.m13 = 0, this.m14 = 0, this.m21 = 0, this.m22 = 1, this.m23 = 0, this.m24 = 0, this.m31 = 0, this.m32 = 0, this.m33 = 1, this.m34 = 0, this.m41 = 0, this.m42 = 0, this.m43 = 0, this.m44 = 1, t ? this.setMatrixValue(t) : this;
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
   * @param source
   * @return the matrix instance
   */
  setMatrixValue(t) {
    return typeof t == "string" && t.length && t !== "none" ? R(t) : Array.isArray(t) || t instanceof Float64Array || t instanceof Float32Array ? b(t) : typeof t == "object" ? N(t) : this;
  }
  /**
   * Returns a *Float32Array* containing elements which comprise the matrix.
   * The method can return either the 16 elements or the 6 elements
   * depending on the value of the `is2D` parameter.
   *
   * @param is2D *Array* representation of the matrix
   * @return an *Array* representation of the matrix
   */
  toFloat32Array(t) {
    return Float32Array.from(x(this, t));
  }
  /**
   * Returns a *Float64Array* containing elements which comprise the matrix.
   * The method can return either the 16 elements or the 6 elements
   * depending on the value of the `is2D` parameter.
   *
   * @param is2D *Array* representation of the matrix
   * @return an *Array* representation of the matrix
   */
  toFloat64Array(t) {
    return Float64Array.from(x(this, t));
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
    const { is2D: t } = this, e = this.toFloat64Array(t).join(", ");
    return `${t ? "matrix" : "matrix3d"}(${e})`;
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
    const { is2D: t, isIdentity: e } = this;
    return { ...this, is2D: t, isIdentity: e };
  }
  /**
   * The Multiply method returns a new CSSMatrix which is the result of this
   * matrix multiplied by the passed matrix, with the passed matrix to the right.
   * This matrix is not modified.
   *
   * @param m2 CSSMatrix
   * @return The resulted matrix.
   */
  multiply(t) {
    return C(this, t);
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
  translate(t, e, i) {
    return this.multiply(v(t, e ?? 0, i ?? 0));
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
  scale(t, e, i) {
    return this.multiply(O(t, e ?? t, i ?? 1));
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
  rotate(t, e, i) {
    let n = t, m = e || 0, a = i || 0;
    return typeof t == "number" && typeof e > "u" && typeof i > "u" && (a = n, n = 0, m = 0), this.multiply(k(n, m, a));
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
  rotateAxisAngle(t = 0, e = 0, i = 0, n = 0) {
    if ([t, e, i, n].some((a) => !Number.isFinite(a)))
      throw new TypeError("CSSMatrix: expecting 4 values");
    return Math.sqrt(t * t + e * e + i * i) === 0 ? N(this) : this.multiply(X(t, e, i, n));
  }
  /**
   * Specifies a skew transformation along the `x-axis` by the given angle.
   * This matrix is not modified.
   *
   * @param angle The angle amount in degrees to skew.
   * @return The resulted matrix
   */
  skewX(t) {
    return this.multiply(Y(t));
  }
  /**
   * Specifies a skew transformation along the `y-axis` by the given angle.
   * This matrix is not modified.
   *
   * @param angle The angle amount in degrees to skew.
   * @return The resulted matrix
   */
  skewY(t) {
    return this.multiply(F(t));
  }
  /**
   * Specifies a skew transformation along both the `x-axis` and `y-axis`.
   * This matrix is not modified.
   *
   * @param angleX The X-angle amount in degrees to skew.
   * @param angleY The angle amount in degrees to skew.
   * @return The resulted matrix
   */
  skew(t, e) {
    return this.multiply(A(t, e));
  }
  /**
   * Modifies the current matrix by post-multiplying it with another matrix.
   * This is the mutable version of multiply().
   *
   * @param m2 The matrix to multiply with
   * @return this matrix (modified)
   */
  multiplySelf(t) {
    const e = C(this, t);
    return Object.assign(this, e), this;
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
  translateSelf(t, e, i) {
    return this.multiplySelf(v(t, e ?? 0, i ?? 0));
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
  scaleSelf(t, e, i) {
    return this.multiplySelf(O(t, e ?? t, i ?? 1));
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
  rotateSelf(t, e, i) {
    let n = t, m = e || 0, a = i || 0;
    return typeof t == "number" && typeof e > "u" && typeof i > "u" && (a = n, n = 0, m = 0), this.multiplySelf(k(n, m, a));
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
  rotateAxisAngleSelf(t = 0, e = 0, i = 0, n = 0) {
    if ([t, e, i, n].some((a) => !Number.isFinite(a)))
      throw new TypeError("CSSMatrix: expecting 4 values");
    return Math.sqrt(t * t + e * e + i * i) === 0 ? this : this.multiplySelf(X(t, e, i, n));
  }
  /**
   * Modifies the current matrix by post-multiplying it with a skewX matrix.
   * This is the mutable version of skewX().
   *
   * @param angle The angle amount in degrees to skew.
   * @return this matrix (modified)
   */
  skewXSelf(t) {
    return this.multiplySelf(Y(t));
  }
  /**
   * Modifies the current matrix by post-multiplying it with a skewY matrix.
   * This is the mutable version of skewY().
   *
   * @param angle The angle amount in degrees to skew.
   * @return this matrix (modified)
   */
  skewYSelf(t) {
    return this.multiplySelf(F(t));
  }
  /**
   * Modifies the current matrix by post-multiplying it with a skew matrix.
   * This is the mutable version of skew().
   *
   * @param angleX The X-angle amount in degrees to skew.
   * @param angleY The Y-angle amount in degrees to skew.
   * @return this matrix (modified)
   */
  skewSelf(t, e) {
    return this.multiplySelf(A(t, e));
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
    const e = this.m11 * t.x + this.m21 * t.y + this.m31 * t.z + this.m41 * t.w, i = this.m12 * t.x + this.m22 * t.y + this.m32 * t.z + this.m42 * t.w, n = this.m13 * t.x + this.m23 * t.y + this.m33 * t.z + this.m43 * t.w, m = this.m14 * t.x + this.m24 * t.y + this.m34 * t.z + this.m44 * t.w;
    return t instanceof DOMPoint ? new DOMPoint(e, i, n, m) : {
      x: e,
      y: i,
      z: n,
      w: m
    };
  }
}
export {
  M as default
};
//# sourceMappingURL=dommatrix.mjs.map
