import CSSMatrix from '.';

/** A DOMMPoint compatible Tuple. */
export interface PointTuple {
  x: number;
  y: number;
  z: number;
  w: number;
}

/** The result of **CSSMatrix.toJSON()** / **DOMMatrix.toJSON()** instance calls. */
export interface JSONMatrix {
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
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
  is2D: boolean;
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
export type CSSMatrixInput = string | any[] | CSSMatrix | DOMMatrix | JSONMatrix | Float32Array | Float64Array;
