# @thednp/dommatrix

[![Coverage Status](https://coveralls.io/repos/github/thednp/dommatrix/badge.svg)](https://coveralls.io/github/thednp/dommatrix)
[![NPM Version](https://img.shields.io/npm/v/@thednp/dommatrix.svg)](https://www.npmjs.com/package/@thednp/dommatrix)
[![JSR Version](https://img.shields.io/jsr/v/@thednp/dommatrix.svg)](https://jsr.io/@thednp/dommatrix)
[![NPM Downloads](https://img.shields.io/npm/dm/@thednp/dommatrix.svg)](http://npm-stat.com/charts.html?@thednp/dommatrix)
[![ci](https://github.com/thednp/dommatrix/actions/workflows/ci.yml/badge.svg)](https://github.com/thednp/dommatrix/actions/workflows/ci.yml)
[![jsDelivr](https://data.jsdelivr.com/v1/package/npm/@thednp/dommatrix/badge)](https://www.jsdelivr.com/package/npm/@thednp/dommatrix)

A TypeScript sourced [DOMMatrix](https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrix) shim for **Node.js** apps and legacy browsers.

## Table of Contents

- [Features](#features)
- [Benchmarks](#benchmarks)
- [Demo](#demo)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [CSSMatrix vs native DOMMatrix](#cssmatrix-vs-native-dommatrix)
- [Alternatives](#alternatives)
- [History](#history)
- [Thanks](#thanks)
- [License](#license)

## Features

- **Zero runtime dependencies** — the entire library is a single file
- **Node.js compatible** — no `DOMMatrix` / `DOMPoint` globals required, works in legacy browsers too
- **Full transform string parsing** — `matrix()`, `matrix3d()`, `translate*()`, `rotate*()`, `rotate3d()`, `scale*()`, `skew*()`, `perspective()` with `deg` / `rad` / `px` units, via `fromString()` or the constructor
- **2D & 3D** — the `m11`-`m44` / `a`-`f` properties, `matrix()` / `matrix3d()` string output
- **Immutable and mutable APIs** — `translate()` returns a new matrix, `translateSelf()` mutates in place, same as native `DOMMatrix`
- **TypeScript** — bundled type definitions, including the `Matrix`, `Matrix3d`, `JSONMatrix` and `PointTuple` types
- **Verified against native** — every method is tested side-by-side with the native `DOMMatrix` in real browsers, with **100% test coverage**

## Benchmarks

<!-- b-summary -->

`CSSMatrix` is **1.2x–91x faster** than the previous 3.0.x release series and **1.8x–162x faster** than the native `DOMMatrix` — except `toString()`, which native does ~1.2x faster.

Every operation's result matches the previous release series and the native `DOMMatrix` to within `1e-9` (output is indistinguishable at the 9th decimal place). Full methodology, per-operation results and interpretation: [BENCHMARK](BENCHMARK.md).

Last updated: **2026-08-05**.

<!-- /b-summary -->

## Demo

See DOMMatrix shim in action, [click me](https://thednp.github.io/dommatrix) and start transforming.

## Installation

```sh
npm install @thednp/dommatrix
# pnpm add @thednp/dommatrix
# bun add @thednp/dommatrix
# deno add npm:@thednp/dommatrix
# deno add jsr:@thednp/dommatrix
# npx jsr add @thednp/dommatrix
```

Install from [JSR](https://jsr.io/@thednp/dommatrix) and import the raw TypeScript source:

```ts
import CSSMatrix from "jsr:@thednp/dommatrix";
```

Download the latest version and copy the `dist/dommatrix.js` file to your project assets folder, then load the file in your front-end:

```html
<script src="./assets/js/dommatrix.js"></script>
```

Alternatively you can load from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@thednp/dommatrix/dist/dommatrix.js"></script>
```

## Quick Start

```js
import CSSMatrix from '@thednp/dommatrix';

// init from a transform string
const myMatrix = new CSSMatrix('matrix(1,0.25,-0.25,1,0,0)');

// mutating methods change the matrix in place
myMatrix.translateSelf(15, 20);
myMatrix.rotateSelf(15);

// apply to styling to target
element.style.transform = myMatrix.toString();
```

> **Immutable vs mutable** — like native `DOMMatrix`, the shim offers both styles. `translate()`, `rotate()`, `scale()`, `skew()` and `multiply()` return a **new** matrix and leave the original untouched; their `*Self()` counterparts mutate the matrix and return `this`. The example above uses `*Self()` because the returned value is discarded.

The constructor accepts the same inputs as the native interface, plus a couple more:

```js
// a valid CSS transform string
const fromString = new CSSMatrix('translate(10px, 20px) rotate(45deg)');

// an array of 6 (2D) or 16 (3D) numbers
const fromArray = new CSSMatrix([1, 0, 0, 1, 15, 25]);

// a JSON object (e.g. the result of another matrix's toJSON())
const fromJSON = new CSSMatrix({ a: 1, b: 0, c: 0, d: 1, e: 15, f: 25 });

// another CSSMatrix instance
const fromMatrix = new CSSMatrix(fromString);

console.log(fromString.toString()); // matrix(1, 0, 0, 1, 10, 20)
console.log(fromArray.toArray());   // [1, 0, 0, 1, 15, 25]
console.log(fromJSON.toJSON());     // { a, b, c, d, e, f, m11..m44, is2D, isIdentity }
console.log(fromMatrix.transformPoint({ x: 0, y: 0, z: 0, w: 1 })); // { x, y, z, w }
```

CommonJS works too, and in Node.js you can import the default as whatever name you want:

```js
// CommonJS
const CSSMatrix = require('@thednp/dommatrix');

// or alias it as a drop-in replacement
const DOMMatrix = CSSMatrix;
```

TypeScript users get the helper types from the package root:

```ts
import CSSMatrix from '@thednp/dommatrix';
import type { Matrix, Matrix3d, JSONMatrix, PointTuple } from '@thednp/dommatrix';

const values: Matrix = [1, 0, 0, 1, 15, 25];
const matrix = new CSSMatrix(values);
```

For the complete JavaScript API, check the [JavaScript API](https://github.com/thednp/DOMMatrix/wiki/JavaScript-API) section in our wiki.

## API Reference

### Static methods

| Method | Description |
| --- | --- |
| `fromString(source)` | Parses any valid CSS transform string |
| `fromArray(array)` | Creates a matrix from an array of 6/16 numbers, `Float32Array` or `Float64Array` |
| `fromMatrix(matrix)` | Creates a matrix from a `CSSMatrix` / `DOMMatrix` instance or a `toJSON()` object |
| `toArray(matrix, is2D?)` | Returns an *Array* of 6/16 values from any compatible matrix |
| `isCompatibleArray(array)` | Checks if a value is a compatible 6/16 number array |
| `isCompatibleObject(object)` | Checks if a value is a `CSSMatrix` / `DOMMatrix` / `JSONMatrix` object |
| `Translate(x, y, z)` | Returns a translation matrix (CSS `translate3d()`) |
| `Rotate(rx, ry, rz)` | Returns a rotation matrix (CSS `rotate3d()`) |
| `RotateAxisAngle(x, y, z, alpha)` | Returns a rotation matrix about a vector (CSS `rotate3d()` with 4 values) |
| `Scale(x, y, z)` | Returns a scale matrix (CSS `scale3d()`) |
| `Skew(angleX, angleY)` | Returns a skew matrix (CSS `skew()`) |
| `SkewX(angle)` | Returns a skew-X matrix (CSS `skewX()`) |
| `SkewY(angle)` | Returns a skew-Y matrix (CSS `skewY()`) |
| `Multiply(m1, m2)` | Returns the multiplication of two matrices |

### Instance methods

| Method | Description |
| --- | --- |
| `setMatrixValue(init)` | Replaces the matrix values from the given string / array / object, mutates in place and returns `this` |
| `translate(x, y?, z?)` / `translateSelf(x, y?, z?)` | Applies a translation (CSS `translate3d()`) |
| `rotate(rx?, ry?, rz?)` / `rotateSelf(rx?, ry?, rz?)` | Applies a rotation; a single value rotates about the z-axis (CSS `rotate()`) |
| `rotateAxisAngle(x, y, z, angle)` / `rotateAxisAngleSelf(...)` | Applies a rotation about a vector (CSS `rotate3d()`) |
| `scale(x, y?, z?)` / `scaleSelf(x, y?, z?)` | Applies a scale; `y` defaults to `x`, `z` to `1` (CSS `scale3d()`) |
| `skew(angleX, angleY)` / `skewSelf(angleX, angleY)` | Applies a skew (CSS `skew()`) |
| `skewX(angle)` / `skewXSelf(angle)` | Applies a skew along the x-axis (CSS `skewX()`) |
| `skewY(angle)` / `skewYSelf(angle)` | Applies a skew along the y-axis (CSS `skewY()`) |
| `multiply(matrix)` / `multiplySelf(matrix)` | Post-multiplies by another matrix |
| `transformPoint(tuple)` | Transforms a `DOMPoint` or `{ x, y, z, w }` tuple |
| `toArray(is2D?)` | Returns an *Array* of 6/16 values |
| `toFloat32Array(is2D?)` / `toFloat64Array(is2D?)` | Returns a typed array of 6/16 values |
| `toString()` | Returns the `matrix()` / `matrix3d()` CSS syntax |
| `toJSON()` | Returns `{ a-f, m11-m44, is2D, isIdentity }` |

### Properties

| Property | Description |
| --- | --- |
| `a`-`f` / `m11`-`m44` | The 2D aliases and the canonical 3D values (kept in sync) |
| `is2D` | Getter — `true` when the matrix represents a 2D transform |
| `isIdentity` | Getter — `true` when the matrix is the identity matrix |

## CSSMatrix vs native DOMMatrix

The shim mirrors the native **DOMMatrix** API surface closely — the same `m11`-`m44` / `a`-`f` properties, the same `matrix()` / `matrix3d()` string output, and the same split between immutable methods (`translate()`, `rotate()`, `scale()`, `skew()`, `multiply()`) and their mutating `*Self()` counterparts. There are, however, some deliberate differences:

| Feature | CSSMatrix shim | Native DOMMatrix |
| --- | --- | --- |
| Environment | Works in **Node.js** and legacy browsers — no `DOMMatrix` / `DOMPoint` globals required | Browser only |
| String parsing | `CSSMatrix.fromString()` static, also via the constructor | Constructor only (`new DOMMatrix(transform)`) |
| Array / typed-array input | `CSSMatrix.fromArray()`, also via the constructor | `DOMMatrix.fromFloat64Array()` / `fromFloat32Array()` statics |
| Object input | `CSSMatrix.fromMatrix()` accepts another matrix or a `toJSON()` object | `DOMMatrix.fromMatrix()` accepts a `DOMMatrixInit` |
| `transformOrigin` argument | Not supported | Supported (`new DOMMatrix(init, transformOrigin)`) |
| `is2D` / `isIdentity` | Computed getters — always reflect the current values | `is2D` is a flag fixed at construction and can report stale results (e.g. after `rotateAxisAngle()`) |
| `transformPoint()` | Accepts a `DOMPoint` **or** a plain `{ x, y, z, w }` tuple; returns the same type it received | Accepts `DOMPointInit`, always returns a `DOMPoint` |
| `setMatrixValue()` | Mutates in place and returns `this`; accepts any of the shim's input types (string, array / typed array, `DOMMatrix`, plain object) | Mutates in place and returns `this`; accepts `DOMMatrixInit` only |
| `toArray()` | Plain `Array` of 6/16 values, alongside `toFloat32Array()` / `toFloat64Array()` | `toFloat32Array()` / `toFloat64Array()` only |
| `toJSON()` | `{ a-f, m11-m44, is2D, isIdentity }` | Same shape |
| TypeScript | Ships bundled type definitions, zero runtime dependencies | WebIDL-generated typings |

Methods of the `DOMMatrixReadOnly` prototype that are not part of this shim: `flipX()`, `flipY()`, `inverse()` and `rotateFromVector()` (`transpose()` is not part of the native interface either). Everything else — `translate*`, `rotate*`, `rotateAxisAngle*`, `scale*`, `skew*`, `multiply*`, `toString()`, `toFloat(32/64)Array()`, `transformPoint()` — is implemented with behavior verified against the native interface by the test suite.

## Alternatives

DOMMatrix shim is meant to be a light pocket tool for many things like [svg-path-commander](http://thednp.github.io/svg-path-commander). For a complete polyfill that fills in the missing `DOMMatrixReadOnly` methods (`inverse()`, `flipX()`, `flipY()`, ...), you might want to also consider [geometry-interfaces](https://github.com/trusktr/geometry-interfaces) and [geometry-polyfill](https://github.com/jarek-foksa/geometry-polyfill).

## History

`@thednp/dommatrix` started as a fork of the [original CSSMatrix](https://github.com/arian/CSSMatrix/). In contrast with the original source there have been a series of changes to the prototype for consistency, performance as well as requirements to better accommodate the **DOMMatrix** interface:

- **changed** how the constructor determines if the matrix is 2D, based on a [more accurate method](https://github.com/jsidea/jsidea/blob/2b4486c131d5cca2334293936fa13454b34fcdef/ts/jsidea/geom/Matrix3D.ts#L788) which is actually checking the designated values of the 3D space; in contrast, the old *CSSMatrix* constructor sets the `afine` property at initialization only and based on the number of arguments or the type of the input CSS transform syntax;
- **fixed** the `translate()`, `scale()` and `rotate()` instance methods to work with one axis transformation, also inline with **DOMMatrix**;
- **added** the `*Self` instance methods — `translateSelf()`, `scaleSelf()`, `rotateSelf()`, `rotateAxisAngleSelf()`, `skewXSelf()`, `skewYSelf()`, `skewSelf()` and `multiplySelf()` — the mutating counterparts of the immutable methods above, inline with the native **DOMMatrix** API;
- **changed** `toString()` instance method to utilize the new method `toArray()` described below;
- **changed** `setMatrixValue()` instance method to do all the heavy duty work with parameters;
- **added** `is2D` (*getter*) property;
- **added** `isIdentity` (*getter*) property;
- **added** `skew()` public method to work in line with native DOMMatrix;
- **added** `Skew()` static method to work with the above `skew()` instance method;
- **added** `fromMatrix` static method, not present in the constructor prototype;
- **added** `fromString` static method, not present in the constructor prototype;
- **added** `fromArray()` static method, not present in the constructor prototype, should also process *Float32Array* / *Float64Array* via `Array.from()`;
- **added** `toFloat64Array()` and `toFloat32Array()` instance methods, the updated `toString()` method makes use of them alongside `toArray`;
- **added** `toArray()` instance method, normalizes values and is used by the `toString()` instance method;
- **added** `toJSON()` instance method will generate a standard *Object* which includes `{a,b,c,d,e,f}` and `{m11,m12,m13,..m44}` properties as well as `is2D` & `isIdentity` properties;
- **added** `transformPoint()` instance method which works like the original;
- **added** `isCompatibleArray()` static method to check if an array is a compatible array of 6/16 numbers;
- **added** `isCompatibleObject()` static method to checks if an object is compatible with CSSMatrix, usually another CSSMatrix / DOMMatrix instance or the result of these instances `toJSON()` method call;
- *removed* `afine` property, it's a very old *WebKitCSSMatrix* defined property;
- *removed* `inverse()` instance method, will be re-added later for other implementations (probably going to be accompanied by `determinant()`, `transpose()` and others);
- *removed* `transform` instance method, not present in the native **DOMMatrix** prototype;
- *removed* `setIdentity()` instance method due to code rework for enabling better TypeScript definitions;
- *removed* `toFullString()` instance method, probably something also from *WebKitCSSMatrix*;
- *removed* `feedFromArray` static method, not present in the constructor prototype, `fromArray()` will cover that;
- *not supported* `fromFloat64Array()` and `fromFloat32Array()` static methods are not supported, our `fromArray()` should handle them just as well;
- *not supported* `flipX()` or `flipY()` instance methods of the *DOMMatrixReadOnly* prototype are not supported;
- *not supported* `scaleNonUniformSelf()` or `rotate3d()` with `{x, y, z}` transform origin parameters are not implemented.

## Thanks

- Joe Pea for his [geometry-interfaces](https://github.com/trusktr/geometry-interfaces)
- Jarek Foksa for his [geometry-polyfill](https://github.com/jarek-foksa/geometry-polyfill)
- Arian Stolwijk for his [CSSMatrix](https://github.com/arian/CSSMatrix/)

## License

DOMMatrix shim is [MIT Licensed](https://github.com/thednp/DOMMatrix/blob/master/LICENSE).
