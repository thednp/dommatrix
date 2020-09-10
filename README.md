# DOMMatrix (Constructor) shim

An ES6/ES7 sourced [DOMMatrix](https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrix) shim for Node.js apps and legacy browsers originally authored by Arian Stolwijk with his [CSSMatrix](https://github.com/arian/CSSMatrix/). 

The constructor should work as defined by the [w3c CSS3 3d Transforms](http://www.w3.org/TR/2011/WD-css3-2d-transforms-20111215/#cssmatrix-interface) specification.

This version comes with the following changes:
 * removed `afine` property and replaced it with `is2D` to be more inline with DOMMatrix
 * added `isIdentity` property
 * removed inverse() instance method
 * removed transform() instance method
 * removed toFullString() instance method


# Install

```
npm install dommatrix
```

# Usage

It should be compatible with documentation defined at [w3.org](http://www.w3.org/TR/2011/WD-css3-2d-transforms-20111215/#cssmatrix-interface) and [WebKitCSSMatrix](https://developer.apple.com/library/iad/documentation/AudioVideo/Reference/WebKitCSSMatrixClassReference/index.html) Safari documentation.

**Examples**
```js
// ES6/ES7
import CSSMatrix from 'dommatrix'

// init
let myMatrix = new CSSMatrix('perspective(400px) rotateX(45deg)')

// call methods, also numeric values should work
myMatrix.translate(45)
```

OR 
```js
// Node.js
var CSSMatrix = require('dommatrix');

// init
let myMatrix = new CSSMatrix('rotate(45deg)')
```


# Methods

- `translate(x, y, z)`
- `scale(x, y, z)`
- `rotate(rx, ry, rz)`
- `rotateAxisAngle(x, y, z, angle)`
- `skewX(angle)`
- `skewY(angle)`
- `toString()`

# License
DOMMatrix is [MIT Licensed](https://github.com/thednp/DOMMatrix/blob/master/LICENSE).