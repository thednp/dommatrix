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
}, T = (s) => (s instanceof Float64Array || s instanceof Float32Array || Array.isArray(s) && s.every((t) => typeof t == "number")) && [6, 16].some((t) => s.length === t), E = (s) => s instanceof DOMMatrix || s instanceof w || typeof s == "object" && Object.keys(I).every((t) => s && t in s), x = (s) => {
  const t = new w(), e = Array.from(s);
  if (!T(e))
    throw TypeError(
      `CSSMatrix: "${e.join(",")}" must be an array with 6/16 numbers.`
    );
  if (e.length === 16) {
    const [
      i,
      n,
      r,
      a,
      h,
      m,
      l,
      c,
      u,
      f,
      p,
      o,
      y,
      d,
      S,
      A
    ] = e;
    t.m11 = i, t.a = i, t.m21 = h, t.c = h, t.m31 = u, t.m41 = y, t.e = y, t.m12 = n, t.b = n, t.m22 = m, t.d = m, t.m32 = f, t.m42 = d, t.f = d, t.m13 = r, t.m23 = l, t.m33 = p, t.m43 = S, t.m14 = a, t.m24 = c, t.m34 = o, t.m44 = A;
  } else if (e.length === 6) {
    const [i, n, r, a, h, m] = e;
    t.m11 = i, t.a = i, t.m12 = n, t.b = n, t.m21 = r, t.c = r, t.m22 = a, t.d = a, t.m41 = h, t.e = h, t.m42 = m, t.f = m;
  }
  return t;
}, C = (s) => {
  if (E(s))
    return x([
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
  const t = String(s).replace(/\s/g, "");
  let e = new w();
  const i = `CSSMatrix: invalid transform string "${s}"`;
  return t.split(")").filter((n) => n).forEach((n) => {
    const [r, a] = n.split("(");
    if (!a) throw TypeError(i);
    const h = a.split(",").map(
      (o) => o.includes("rad") ? parseFloat(o) * (180 / Math.PI) : parseFloat(o)
    ), [m, l, c, u] = h, f = [m, l, c], p = [m, l, c, u];
    if (r === "perspective" && m && [l, c].every((o) => o === void 0))
      e.m34 = -1 / m;
    else if (r.includes("matrix") && [6, 16].includes(h.length) && h.every((o) => !Number.isNaN(+o))) {
      const o = h.map((y) => Math.abs(y) < 1e-6 ? 0 : y);
      e = e.multiply(x(o));
    } else if (r === "translate3d" && f.every((o) => !Number.isNaN(+o)))
      e = e.translate(m, l, c);
    else if (r === "translate" && m && c === void 0)
      e = e.translate(m, l || 0, 0);
    else if (r === "rotate3d" && p.every((o) => !Number.isNaN(+o)) && u)
      e = e.rotateAxisAngle(m, l, c, u);
    else if (r === "rotate" && m && [l, c].every((o) => o === void 0))
      e = e.rotate(0, 0, m);
    else if (r === "scale3d" && f.every((o) => !Number.isNaN(+o)) && f.some((o) => o !== 1))
      e = e.scale(m, l, c);
    else if (
      // prop === "scale" && !Number.isNaN(x) && x !== 1 && z === undefined
      // prop === "scale" && !Number.isNaN(x) && [x, y].some((n) => n !== 1) &&
      r === "scale" && !Number.isNaN(m) && (m !== 1 || l !== 1) && c === void 0
    ) {
      const y = Number.isNaN(+l) ? m : l;
      e = e.scale(m, y, 1);
    } else if (r === "skew" && (m || !Number.isNaN(m) && l) && c === void 0)
      e = e.skew(m, l || 0);
    else if (["translate", "rotate", "scale", "skew"].some(
      (o) => r.includes(o)
    ) && /[XYZ]/.test(r) && m && [l, c].every((o) => o === void 0))
      if (r === "skewX" || r === "skewY")
        e = e[r](m);
      else {
        const o = r.replace(/[XYZ]/, ""), y = r.replace(o, ""), d = ["X", "Y", "Z"].indexOf(y), S = o === "scale" ? 1 : 0, A = [
          d === 0 ? m : S,
          d === 1 ? m : S,
          d === 2 ? m : S
        ];
        e = e[o](...A);
      }
    else
      throw TypeError(i);
  }), e;
}, N = (s, t) => t ? [s.a, s.b, s.c, s.d, s.e, s.f] : [
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
], g = (s, t, e) => {
  const i = new w();
  return i.m41 = s, i.e = s, i.m42 = t, i.f = t, i.m43 = e, i;
}, v = (s, t, e) => {
  const i = new w(), n = Math.PI / 180, r = s * n, a = t * n, h = e * n, m = Math.cos(r), l = -Math.sin(r), c = Math.cos(a), u = -Math.sin(a), f = Math.cos(h), p = -Math.sin(h), o = c * f, y = -c * p;
  i.m11 = o, i.a = o, i.m12 = y, i.b = y, i.m13 = u;
  const d = l * u * f + m * p;
  i.m21 = d, i.c = d;
  const S = m * f - l * u * p;
  return i.m22 = S, i.d = S, i.m23 = -l * c, i.m31 = l * p - m * u * f, i.m32 = l * f + m * u * p, i.m33 = m * c, i;
}, k = (s, t, e, i) => {
  const n = new w(), r = Math.sqrt(s * s + t * t + e * e);
  if (r === 0)
    return n;
  const a = s / r, h = t / r, m = e / r, l = i * (Math.PI / 360), c = Math.sin(l), u = Math.cos(l), f = c * c, p = a * a, o = h * h, y = m * m, d = 1 - 2 * (o + y) * f;
  n.m11 = d, n.a = d;
  const S = 2 * (a * h * f + m * c * u);
  n.m12 = S, n.b = S, n.m13 = 2 * (a * m * f - h * c * u);
  const A = 2 * (h * a * f - m * c * u);
  n.m21 = A, n.c = A;
  const F = 1 - 2 * (y + p) * f;
  return n.m22 = F, n.d = F, n.m23 = 2 * (h * m * f + a * c * u), n.m31 = 2 * (m * a * f + h * c * u), n.m32 = 2 * (m * h * f - a * c * u), n.m33 = 1 - 2 * (p + o) * f, n;
}, X = (s, t, e) => {
  const i = new w();
  return i.m11 = s, i.a = s, i.m22 = t, i.d = t, i.m33 = e, i;
}, b = (s, t) => {
  const e = new w();
  if (s) {
    const i = s * Math.PI / 180, n = Math.tan(i);
    e.m21 = n, e.c = n;
  }
  if (t) {
    const i = t * Math.PI / 180, n = Math.tan(i);
    e.m12 = n, e.b = n;
  }
  return e;
}, Y = (s) => b(s, 0), O = (s) => b(0, s), M = (s, t) => {
  const e = t.m11 * s.m11 + t.m12 * s.m21 + t.m13 * s.m31 + t.m14 * s.m41, i = t.m11 * s.m12 + t.m12 * s.m22 + t.m13 * s.m32 + t.m14 * s.m42, n = t.m11 * s.m13 + t.m12 * s.m23 + t.m13 * s.m33 + t.m14 * s.m43, r = t.m11 * s.m14 + t.m12 * s.m24 + t.m13 * s.m34 + t.m14 * s.m44, a = t.m21 * s.m11 + t.m22 * s.m21 + t.m23 * s.m31 + t.m24 * s.m41, h = t.m21 * s.m12 + t.m22 * s.m22 + t.m23 * s.m32 + t.m24 * s.m42, m = t.m21 * s.m13 + t.m22 * s.m23 + t.m23 * s.m33 + t.m24 * s.m43, l = t.m21 * s.m14 + t.m22 * s.m24 + t.m23 * s.m34 + t.m24 * s.m44, c = t.m31 * s.m11 + t.m32 * s.m21 + t.m33 * s.m31 + t.m34 * s.m41, u = t.m31 * s.m12 + t.m32 * s.m22 + t.m33 * s.m32 + t.m34 * s.m42, f = t.m31 * s.m13 + t.m32 * s.m23 + t.m33 * s.m33 + t.m34 * s.m43, p = t.m31 * s.m14 + t.m32 * s.m24 + t.m33 * s.m34 + t.m34 * s.m44, o = t.m41 * s.m11 + t.m42 * s.m21 + t.m43 * s.m31 + t.m44 * s.m41, y = t.m41 * s.m12 + t.m42 * s.m22 + t.m43 * s.m32 + t.m44 * s.m42, d = t.m41 * s.m13 + t.m42 * s.m23 + t.m43 * s.m33 + t.m44 * s.m43, S = t.m41 * s.m14 + t.m42 * s.m24 + t.m43 * s.m34 + t.m44 * s.m44;
  return x([
    e,
    i,
    n,
    r,
    a,
    h,
    m,
    l,
    c,
    u,
    f,
    p,
    o,
    y,
    d,
    S
  ]);
};
class w {
  static Translate = g;
  static Rotate = v;
  static RotateAxisAngle = k;
  static Scale = X;
  static SkewX = Y;
  static SkewY = O;
  static Skew = b;
  static Multiply = M;
  static fromArray = x;
  static fromMatrix = C;
  static fromString = R;
  static toArray = N;
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
    return typeof t == "string" && t.length && t !== "none" ? R(t) : Array.isArray(t) || t instanceof Float64Array || t instanceof Float32Array ? x(t) : typeof t == "object" ? C(t) : this;
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
    return Float32Array.from(N(this, t));
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
    return Float64Array.from(N(this, t));
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
    return M(this, t);
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
    const n = t;
    let r = e, a = i;
    return typeof r > "u" && (r = 0), typeof a > "u" && (a = 0), M(this, g(n, r, a));
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
    const n = t;
    let r = e, a = i;
    return typeof r > "u" && (r = t), typeof a > "u" && (a = 1), M(this, X(n, r, a));
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
    let n = t, r = e || 0, a = i || 0;
    return typeof t == "number" && typeof e > "u" && typeof i > "u" && (a = n, n = 0, r = 0), M(this, v(n, r, a));
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
  rotateAxisAngle(t, e, i, n) {
    if ([t, e, i, n].some((r) => !Number.isFinite(r)))
      throw new TypeError("CSSMatrix: expecting 4 values");
    return M(this, k(t, e, i, n));
  }
  /**
   * Specifies a skew transformation along the `x-axis` by the given angle.
   * This matrix is not modified.
   *
   * @param angle The angle amount in degrees to skew.
   * @return The resulted matrix
   */
  skewX(t) {
    return M(this, Y(t));
  }
  /**
   * Specifies a skew transformation along the `y-axis` by the given angle.
   * This matrix is not modified.
   *
   * @param angle The angle amount in degrees to skew.
   * @return The resulted matrix
   */
  skewY(t) {
    return M(this, O(t));
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
    return M(this, b(t, e));
  }
  /**
   * Modifies the current matrix by post-multiplying it with another matrix.
   * This is the mutable version of multiply().
   *
   * @param m2 The matrix to multiply with
   * @return this matrix (modified)
   */
  multiplySelf(t) {
    const e = M(this, t);
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
    return this.multiplySelf(g(t, e ?? 0, i ?? 0));
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
    return this.multiplySelf(X(t, e ?? t, i ?? 1));
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
    let n = t, r = e || 0, a = i || 0;
    return typeof t == "number" && typeof e > "u" && typeof i > "u" && (a = n, n = 0, r = 0), this.multiplySelf(v(n, r, a));
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
  rotateAxisAngleSelf(t, e, i, n) {
    if ([t, e, i, n].some((r) => !Number.isFinite(r)))
      throw new TypeError("CSSMatrix: expecting 4 values");
    return this.multiplySelf(k(t, e, i, n));
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
    return this.multiplySelf(O(t));
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
    return this.multiplySelf(b(t, e));
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
    const e = this.m11 * t.x + this.m21 * t.y + this.m31 * t.z + this.m41 * t.w, i = this.m12 * t.x + this.m22 * t.y + this.m32 * t.z + this.m42 * t.w, n = this.m13 * t.x + this.m23 * t.y + this.m33 * t.z + this.m43 * t.w, r = this.m14 * t.x + this.m24 * t.y + this.m34 * t.z + this.m44 * t.w;
    return t instanceof DOMPoint ? new DOMPoint(e, i, n, r) : {
      x: e,
      y: i,
      z: n,
      w: r
    };
  }
}
export {
  w as default
};
//# sourceMappingURL=dommatrix.mjs.map
