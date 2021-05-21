# DOMMatrix shim

An ES6+ sourced [DOMMatrix](https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrix) shim for **Node.js** apps and legacy browsers. Since this source is modernized, legacy browsers might need some additional shims.

[![NPM Version](https://img.shields.io/npm/v/dommatrix.svg?style=flat-square)](https://www.npmjs.com/package/dommatrix)
[![NPM Downloads](https://img.shields.io/npm/dm/dommatrix.svg?style=flat-square)](http://npm-stat.com/charts.html?dommatrix)
[![jsDeliver](https://data.jsdelivr.com/v1/package/npm/dommatrix/badge)](https://www.jsdelivr.com/package/npm/dommatrix)

The constructor is almost equivalent with the **DOMMatrix** in many respects, but tries to keep a sense of simplicity. In that note, we haven't implemented [DOMMatrixReadOnly](https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrixReadOnly) methods like `flipX()` or `inverse()` or aliases for the main methods like `translateSelf` or the old `rotate3d`.

# Installation
```js
npm install dommatrix
```
Download the latest version and copy the `dist/dommatrix.min.js` file to your project assets folder, then load the file in your front-end:
```html
<script src="./assets/js/dommatrix.min.js">
```

Alternativelly you can load from CDN:
```html
<script src="https://cdn.jsdelivr.net/npm/dommatrix/dist/dommatrix.min.js">
```

# Usage
In your regular day to day usage, you will find yourself writing something like this:
```js
import CSSMatrix from 'dommatrix';

// init
let myMatrix = new CSSMatrix('matrix(1,0.25,-0.25,1,0,0)');

// apply methods
myMatrix.translate(15);
myMatrix.rotate(15);

// apply to styling to target
element.style.transform = myMatrix.toString();
```
For the complete JavaScript API, check the [JavaScript API](https://github.com/thednp/DOMMatrix/wiki/JavaScript-API) section in our wiki.

# WIKI
For more indepth guides, head over to the [wiki pages](https://github.com/thednp/DOMMatrix/wiki) for developer guidelines.

# More Info
In contrast with the [original source](https://github.com/arian/CSSMatrix/) there have been a series of changes to the prototype for consistency, performance as well as requirements to better accomodate the **DOMMatrix** interface:

* **changed** the order of the initialization parameters of a 3D matrix, now uses the column major order, as described in the specification pages; this change is to accommodate outputs of `toFloat64Array()` of the DOMMatrix constructor (which also returns items in the expected order);
* **changed** how the constructor determines if the matrix is 2D, based on a [more accurate method](https://github.com/jsidea/jsidea/blob/2b4486c131d5cca2334293936fa13454b34fcdef/ts/jsidea/geom/Matrix3D.ts#L788) which is actually checking the designated values of the 3D space; in contrast, the old *CSSMatrix* constructor sets `afine` property at initialization only and based on the number of arguments or the type of the input CSS transform syntax; 
* **fixed** the `translate()`, `scale()` and `rotate()` instance methods to work with one axis transformation, also inline with **DOMMatrix**;
* **changed** `toString()` instance method to utilize the new method `toArray()` described below;
* **changed** `setMatrixValue()` instance method to do all the heavy duty work with parameters;
* *removed* `afine` property, it's a very old *WebKitCSSMatrix* defined property;
* *removed* `inverse()` instance method, will be re-added later for other implementations (probably going to be accompanied by `determinant()`, `transpose()` and others);
* *removed* `toFullString()` instance method, probably something also from *WebKitCSSMatrix*;
* **added** `is2D` (*getter* and *setter*) property;
* **added** `isIdentity` (*getter* and *setter*) property;
* **added** `feedFromArray` static method, not present in the constructor prototype;
* **added** `fromMatrix` static method, not present in the constructor prototype;
* **added** `fromArray()`, `fromFloat64Array()` and `fromFloat32Array()` static methods, not present in the constructor prototype, the last 2 are not published since `fromArray()` can also process *Float32Array* / *Float64Array* via `Array.from()`;
* **added** `toArray()`, `toFloat64Array()` and `toFloat32Array()` instance methods, the last two are not present in the constructor prototype;
* **added** `transformPoint()` instance method which works like the original.


# Thanks
* Arian Stolwijk for his [CSSMatrix](https://github.com/arian/CSSMatrix/)


# License
DOMMatrix shim is [MIT Licensed](https://github.com/thednp/DOMMatrix/blob/master/LICENSE).
