import type CSSMatrix from ".";

/** A DOMPoint compatible Tuple. */
export interface PointTuple {
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
export interface JSONMatrix {
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
export type Matrix = [number, number, number, number, number, number];

/** An array of 16 numbers representing a 3D matrix. */
export type Matrix3d = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

/** All CSSMatrix compatible initialization values. */
export type CSSMatrixInput =
  | string
  | number[]
  | Matrix
  | Matrix3d
  | CSSMatrix
  | DOMMatrix
  | JSONMatrix
  | Float32Array
  | Float64Array;
