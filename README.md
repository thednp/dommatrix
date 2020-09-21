# DOMMatrix shim

An ES6+ sourced [DOMMatrix](https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrix) shim for **Node.js** apps and legacy browsers. Legacy browsers might need some other shims here and there.

The constructor is almost equivalent with the **DOMMatrix** in many respects, but tries to keep a sense of simplicity. In that note, we haven't implemented [DOMMatrixReadOnly](https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrixReadOnly) methods like `flipX()` or `inverse()` or aliases for the main methods like `translateSelf` or the old `rotate3d`.

In contrast with the [original source](https://github.com/arian/CSSMatrix/) there have been a series of changes to the prototype for consistency, performance as well as requirements to better accomodate the **DOMMatrix** interface:

* **changed** the order of the initialization parameters of a 3D matrix, now uses the column major order, as described in the specification pages; this change is to accommodate outputs of `toFloat64Array()` of the DOMMatrix constructor (which also returns items in the expected order);
* **changed** how the constructor determines if the matrix is 2D, based on a [more accurate method](https://github.com/jsidea/jsidea/blob/2b4486c131d5cca2334293936fa13454b34fcdef/ts/jsidea/geom/Matrix3D.ts#L788) which is actually checking the designated values of the 3D space; in contrast, the old *CSSMatrix* constructor sets `afine` property at initialization only and based on the number of arguments or the type of the input CSS transform syntax; 
* **fixed** the `translate()`, `scale()` and `rotate()` instance methods to work with one axis transformation, also inline with **DOMMatrix**;
* **changed** `toString()` instance method to utilize the new method `toArray()` described below;
* **changed** `setMatrixValue()` instance method to do all the heavy duty work with parameters;
* *removed* `afine` property, it's a very old *WebKitCSSMatrix* defined property;
* *removed* `inverse()` instance method, will be re-added later for other implementations (probably going to be accompanied by `determinant()`, `transpose()` and others);
* *removed* `transform()` instance method, replaced with something that actually works;
* *removed* `toFullString()` instance method, probably something also from *WebKitCSSMatrix*;
* **added** `is2D` (*getter* and *setter*) property;
* **added** `isIdentity` (*getter* and *setter*) property;
* **added** `feedFromArray` static method, not present in the constructor prototype;
* **added** `fromMatrix` static method, not present in the constructor prototype;
* **added** `fromArray()`, `fromFloat64Array()` and `fromFloat32Array()` static methods, not present in the constructor prototype, the last 2 are not published since `fromArray()` can also process *Float32Array* / *Float64Array* via `Array.from()`;
* **added** `toArray()`, `toFloat64Array()` and `toFloat32Array()` instance methods, the last two are not present in the constructor prototype;
* **added** `transformPoint()` instance method which works like the original and replaces the old `transform()` method.


# Install

```
npm install dommatrix
```

# Usage

The initialization doesn't support CSS syntax strings with transform functions like `rotate()` or `translate()` only `matrix()` and `matrix3d()`, or 6/16 elements arrays.

**Basics**
```js
// ES6+
import CSSMatrix from 'dommatrix'

// init
let myMatrix = new CSSMatrix('matrix(1,0.25,-0.25,1,0,0)')
```

OR 
```js
// Node.js
var CSSMatrix = require('dommatrix');

// init
let myMatrix = new CSSMatrix()
```


**Advanced API Examples**

```js
import CSSMatrix from 'dommatrix'

// init
let myMatrix = new CSSMatrix('matrix(1,0.25,-0.25,1,0,0)')

// the above is equivalent with providing the values are arguments
let myMatrix = new CSSMatrix(1,0.25,-0.25,1,0,0)
// or by providing an Array, Float32Array, Float64Array
let myMatrix = new CSSMatrix([1,0.25,-0.25,1,0,0])

// call methods to apply transformations
let myMatrix = new CSSMatrix().translate(15)
// equivalent to 
let myMatrix = new CSSMatrix().translate(15,0)
// equivalent to 
let myMatrix = new CSSMatrix().translate(15,0,0)

// rotations work as expected
let myMatrix = new CSSMatrix().rotate(15)
// equivalent to 
let myMatrix = new CSSMatrix().rotate(0,0,15)
```


# Standard Methods - described in the W3C draft

**translate(x, y, z)** 

The translate method returns a new matrix which is this matrix post multiplied by a translation matrix containing the passed values. If the `z` parameter is undefined, a 0 value is used in its place. This matrix is not
modified.

Parameters:
* `x` the X axis component of the translation value.
* `y` the Y axis component of the translation value.
* `z` the Z axis component of the translation value.


**rotate(rx, ry, rz)**

The rotate method returns a new matrix which is this matrix post multiplied by each of 3 rotation matrices about the major axes, first X, then Y, then Z. If the `y` and `z` components are undefined, the `x` value is used to rotate the
object about the `z` axis, as though the vector (0,0,x) were passed. All rotation values are expected to be in degrees. This matrix is not modified.

Parameters:
* `rx` the X axis component of the rotation value.
* `ry` the Y axis component of the rotation value.
* `rz` the Z axis component of the rotation value.


**rotateAxisAngle(x, y, z, angle)**

This method returns a new matrix which is this matrix post multiplied by a rotation matrix with the given axis and `angle`. The right-hand rule is used to determine the direction of rotation. All rotation values are
in degrees. This matrix is not modified.

Parameters:
* `x` The X component of the axis vector.
* `y` The Y component of the axis vector.
* `z` The Z component of the axis vector.
* `angle` The angle of rotation about the axis vector, in degrees.


**scale(x, y, z)**

The scale method returns a new matrix which is this matrix post multiplied by a scale matrix containing the passed values. If the `z` component is undefined, a 1 value is used in its place. If the `y` component is undefined, the `x` component value is used in its place. This matrix is not modified.

Parameters:
* `x` the X axis component of the scale value.
* `y` the Y axis component of the scale value.
* `z` the Z axis component of the scale value.


**skewX(angle)**

Specifies a skew transformation along the `x-axis` by the given angle. This matrix is not modified.

The `angle` parameter sets the amount in degrees to skew.


**skewY(angle)**

Specifies a skew transformation along the `y-axis` by the given angle. This matrix is not modified.

The `angle` parameter sets the amount in degrees to skew.


**toString()**

Creates and returns a string representation of the matrix in CSS matrix syntax, using the appropriate CSS matrix notation.
The 16 items in the array 3D matrix array are *transposed* in row-major order.

Depending on the value of `is2D`, the method will return the CSS matrix syntax in one of the two formats:

* `matrix3d(m11,m12,m13,m14,m21,m22,m23,m24,m31,m32,m33,m34,m41,m42,m43,m44)`
* `matrix(a, b, c, d, e, f)`


**transformPoint(point)**

Transforms the specified point using the matrix, returning a new `DOMPoint` like *Object* containing the transformed point. 
Neither the matrix nor the original point are altered.

The method is equivalent with `transformPoint()` method of the `DOMMatrix` constructor.

The `point` parameter expects a vector *Object* with `x`, `y`, `z` and `w` properties or a `DOMPoint`


# Additional Methods

**multiply(m2)**

The multiply method returns a new `CSSMatrix` which is the result of this matrix multiplied by the passed matrix, with the passed matrix to the right. This matrix as well as the one passed are not modified.

The `m2` parameter is expecting a `CSSMatrix` or `DOMMatrix` instance.


**setMatrixValue(string)**

The setMatrixValue method replaces the existing matrix with one computed in the browser. EG: `matrix(1,0.25,-0.25,1,0,0)`.

The method also accepts 6/16 elements *Float64Array* / *Float32Array* / *Array* values, the result of `CSSMatrix` => `toArray()` / `DOMMatrix` => `toFloat64Array()` / `toFloat32Array()`.

For simplicity reasons, this method expects only valid *matrix()* / *matrix3d()* string values, which means other transform functions like *translate()*, *rotate()* are not supported.

Parameter:
* The `source` parameter is either the String representing the CSS syntax of the matrix, which is also the result of `getComputedStyle()`.
* The `source` can also be an *Array* resulted from `toArray()` method calls.


**setIdentity()**

Set the current `CSSMatrix` instance to the identity form and returns it.


**toArray(transposed)**

Returns an *Array* containing all 16 elements which comprise the 3D matrix. The method can return either the elements in default column major order or row major order (what we call the *transposed* matrix, used by `toString`).

If the matrix attribute `is2D` is `true`, the 6 elements array matrix is returned.

Other methods make use of this method to feed their output values from this matrix.

The `transposed` parameter changes the order of the elements in the output. By default the column major order is used, which is the standard representation of a typical 4x4 3D transformation matrix, however the `CSS` syntax requires the row major order, so we can set this parameter to `true` to facilitate that.

There are also *toFloat64Array()* and *toFloat32Array()* which return a new `Float64Array` / `toFloat32Array` containing all 6/16 elements which comprise the matrix. The elements are stored into the array as double-precision floating-point numbers (`Float64Array`) or single-precision floating-point numbers (`Float32Array`), in column-major (colexographical access access or "colex") order. These last two methods are not yet present in the prototype, but are ready to go.

The result can be immediatelly fed as parameter for the initialization of a new matrix. 


# Getters and Setters

**isIdentity**

A `Boolean` whose value is `true` if the matrix is the identity matrix. The identity matrix is one in which every value is 0 except those on the main diagonal from top-left to bottom-right corner (in other words, where the offsets in each direction are equal).


**is2D**

A `Boolean` flag whose value is `true` if the matrix was initialized as a 2D matrix and `false` if the matrix is 3D.


# Static Methods - not included in the constructor prototype

**fromMatrix(m2)**

Creates a new mutable `CSSMatrix` object given an existing matrix or a `DOMMatrix` *Object* which provides the values for its properties. The `m2` parameter is the matrix instance passed into the method and neither this matrix or the one passed are modified.


**fromArray(array)**

Creates a new mutable `CSSMatrix` object given an array of values. If the array has six values, the result is a 2D matrix; if the array has 16 values, the result is a 3D matrix. Otherwise, a `console.error` is thrown and returns the current matrix.

The `array` parameter is the source to feed the values for the new matrix.

There are two more methods *fromFloat64Array(array)* and *fromFloat32Array(array)* which are only aliases for `fromArray` for now, but will be updated accordingly once DOMMatrix API is final.


**feedFromArray(array)**

Feed a `CSSMatrix` object with the values of a 6/16 values array and returns the updated matrix.

The `array` parameter is the source to feed the values for the new matrix.

There are two more methods *fromFloat64Array(array)* and *fromFloat32Array(array)* which are only aliases for `fromArray` for now, but will be updated accordingly once DOMMatrix API is final.


# Thanks
* Arian Stolwijk for his [CSSMatrix](https://github.com/arian/CSSMatrix/)


# License
DOMMatrix shim is [MIT Licensed](https://github.com/thednp/DOMMatrix/blob/master/LICENSE).