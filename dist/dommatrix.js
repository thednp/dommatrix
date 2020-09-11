/*!
* DOMMatrix v0.0.3 (https://github.com/thednp/dommatrix)
* Copyright 2020 © thednp
* Licensed under MIT (https://github.com/thednp/DOMMatrix/blob/master/LICENSE)
*/
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.CSSMatrix = factory());
}(this, (function () { 'use strict';

	function Rotate(rx, ry, rz){
		rx *= Math.PI / 180;
		ry *= Math.PI / 180;
		rz *= Math.PI / 180;
		var cosx = Math.cos(rx), sinx = - Math.sin(rx);
		var cosy = Math.cos(ry), siny = - Math.sin(ry);
		var cosz = Math.cos(rz), sinz = - Math.sin(rz);
		var m = new CSSMatrix();
		m.m11 = m.a = cosy * cosz;
		m.m12 = m.b = - cosy * sinz;
		m.m13 = siny;
		m.m21 = m.c = sinx * siny * cosz + cosx * sinz;
		m.m22 = m.d = cosx * cosz - sinx * siny * sinz;
		m.m23 = - sinx * cosy;
		m.m31 = sinx * sinz - cosx * siny * cosz;
		m.m32 = sinx * cosz + cosx * siny * sinz;
		m.m33 = cosx * cosy;
		return m
	}
	function RotateAxisAngle(x, y, z, angle){
		angle *= Math.PI / 360;
		var sinA = Math.sin(angle), cosA = Math.cos(angle), sinA2 = sinA * sinA;
		var length = Math.sqrt(x * x + y * y + z * z);
		if (length === 0){
			x = 0;
			y = 0;
			z = 1;
		} else {
			x /= length;
			y /= length;
			z /= length;
		}
		var x2 = x * x, y2 = y * y, z2 = z * z;
		var m = new CSSMatrix();
		m.m11 = m.a = 1 - 2 * (y2 + z2) * sinA2;
		m.m12 = m.b = 2 * (x * y * sinA2 + z * sinA * cosA);
		m.m13 = 2 * (x * z * sinA2 - y * sinA * cosA);
		m.m21 = m.c = 2 * (y * x * sinA2 - z * sinA * cosA);
		m.m22 = m.d = 1 - 2 * (z2 + x2) * sinA2;
		m.m23 = 2 * (y * z * sinA2 + x * sinA * cosA);
		m.m31 = 2 * (z * x * sinA2 + y * sinA * cosA);
		m.m32 = 2 * (z * y * sinA2 - x * sinA * cosA);
		m.m33 = 1 - 2 * (x2 + y2) * sinA2;
		m.m14 = m.m24 = m.m34 = 0;
		m.m41 = m.e = m.m42 = m.f = m.m43 = 0;
		m.m44 = 1;
		return m
	}
	function Scale(x, y, z){
		var m = new CSSMatrix();
		m.m11 = m.a = x;
		m.m22 = m.d = y;
		m.m33 = z;
		return m
	}
	function SkewX(angle){
		angle *= Math.PI / 180;
		var m = new CSSMatrix();
		m.m21 = m.c = Math.tan(angle);
		return m
	}
	function SkewY(angle){
		angle *= Math.PI / 180;
		var m = new CSSMatrix();
		m.m12 = m.b = Math.tan(angle);
		return m
	}
	function Translate(x, y, z){
		var m = new CSSMatrix();
		m.m41 = m.e = x;
		m.m42 = m.f = y;
		m.m43 = z;
		return m
	}
	function multiply(m1, m2){
		var m11 = m2.m11 * m1.m11 + m2.m12 * m1.m21 + m2.m13 * m1.m31 + m2.m14 * m1.m41,
				m12 = m2.m11 * m1.m12 + m2.m12 * m1.m22 + m2.m13 * m1.m32 + m2.m14 * m1.m42,
				m13 = m2.m11 * m1.m13 + m2.m12 * m1.m23 + m2.m13 * m1.m33 + m2.m14 * m1.m43,
				m14 = m2.m11 * m1.m14 + m2.m12 * m1.m24 + m2.m13 * m1.m34 + m2.m14 * m1.m44,
				m21 = m2.m21 * m1.m11 + m2.m22 * m1.m21 + m2.m23 * m1.m31 + m2.m24 * m1.m41,
				m22 = m2.m21 * m1.m12 + m2.m22 * m1.m22 + m2.m23 * m1.m32 + m2.m24 * m1.m42,
				m23 = m2.m21 * m1.m13 + m2.m22 * m1.m23 + m2.m23 * m1.m33 + m2.m24 * m1.m43,
				m24 = m2.m21 * m1.m14 + m2.m22 * m1.m24 + m2.m23 * m1.m34 + m2.m24 * m1.m44,
				m31 = m2.m31 * m1.m11 + m2.m32 * m1.m21 + m2.m33 * m1.m31 + m2.m34 * m1.m41,
				m32 = m2.m31 * m1.m12 + m2.m32 * m1.m22 + m2.m33 * m1.m32 + m2.m34 * m1.m42,
				m33 = m2.m31 * m1.m13 + m2.m32 * m1.m23 + m2.m33 * m1.m33 + m2.m34 * m1.m43,
				m34 = m2.m31 * m1.m14 + m2.m32 * m1.m24 + m2.m33 * m1.m34 + m2.m34 * m1.m44,
				m41 = m2.m41 * m1.m11 + m2.m42 * m1.m21 + m2.m43 * m1.m31 + m2.m44 * m1.m41,
				m42 = m2.m41 * m1.m12 + m2.m42 * m1.m22 + m2.m43 * m1.m32 + m2.m44 * m1.m42,
				m43 = m2.m41 * m1.m13 + m2.m42 * m1.m23 + m2.m43 * m1.m33 + m2.m44 * m1.m43,
				m44 = m2.m41 * m1.m14 + m2.m42 * m1.m24 + m2.m43 * m1.m34 + m2.m44 * m1.m44;
		return new CSSMatrix(
			m11, m12, m13, m14,
			m21, m22, m23, m24,
			m31, m32, m33, m34,
			m41, m42, m43, m44
		)
	}
	var CSSMatrix = function CSSMatrix(){
		var a = [].slice.call(arguments), m = this;
		if (a.length) { for (var i = a.length; i--;){
			if (Math.abs(a[i]) < 1e-6) { a[i] = 0; }
		} }
		m.setIdentity();
		if (a.length == 16){
			m.is2D = false;
			m.isIdentity = false;
			m.m11 = m.a = a[0];  m.m12 = m.b = a[1];  m.m13 = a[2];  m.m14 = a[3];
			m.m21 = m.c = a[4];  m.m22 = m.d = a[5];  m.m23 = a[6];  m.m24 = a[7];
			m.m31 = a[8];  m.m32 = a[9];  m.m33 = a[10]; m.m34 = a[11];
			m.m41 = m.e = a[12]; m.m42 = m.f = a[13]; m.m43 = a[14]; m.m44 = a[15];
		} else if (a.length == 6) {
			m.is2D = true;
			m.isIdentity = false;
			m.m11 = m.a = a[0]; m.m12 = m.b = a[1]; m.m14 = m.e = a[4];
			m.m21 = m.c = a[2]; m.m22 = m.d = a[3]; m.m24 = m.f = a[5];
		} else if (a.length === 1 && typeof a[0] == 'string') {
			m.setMatrixValue(a[0]);
		} else if (a.length > 0) {
			throw new TypeError('Invalid Matrix Value');
		}
	};
	CSSMatrix.prototype.setMatrixValue = function setMatrixValue (string){
		string = String(string).trim();
		var m = this;
		m.setIdentity();
		if (string == 'none') { return m; }
		var type = string.slice(0, string.indexOf('(')), parts, i;
		if (type == 'matrix3d'){
			m.is2D = false;
			m.isIdentity = false;
			parts = string.slice(9, -1).split(',');
			for (i = parts.length; i--;) { parts[i] = +(parts[i]); }
			m.m11 = m.a = parts[0]; m.m12 = m.b = parts[1]; m.m13 = parts[2];  m.m14 = parts[3];
			m.m21 = m.c = parts[4]; m.m22 = m.d = parts[5]; m.m23 = parts[6];  m.m24 = parts[7];
			m.m31 = parts[8]; m.m32 = parts[9]; m.m33 = parts[10]; m.m34 = parts[11];
			m.m41 = m.e = parts[12]; m.m42 = m.f = parts[13]; m.m43 = parts[14]; m.m44 = parts[15];
		} else if (type == 'matrix'){
			m.is2D = true;
			m.isIdentity = false;
			parts = string.slice(7, -1).split(',');
			for (i = parts.length; i--;) { parts[i] = +(parts[i]); }
			m.m11 = m.a = parts[0]; m.m12 = m.b = parts[2]; m.m41 = m.e = parts[4];
			m.m21 = m.c = parts[1]; m.m22 = m.d = parts[3]; m.m42 = m.f = parts[5];
		} else {
			throw new TypeError('Invalid Matrix Value');
		}
		return m
	};
	CSSMatrix.prototype.multiply = function multiply$1 (m2){
		return multiply(this, m2)
	};
	CSSMatrix.prototype.translate = function translate (x, y, z){
		if (z == null) { z = 0; }
		if (y == null) { y = 0; }
		this.m34 !== 0 && z && (this.is2D = false);
		return multiply(this, Translate(x, y, z))
	};
	CSSMatrix.prototype.scale = function scale (x, y, z){
		if (y == null) { y = x; }
		if (z == null) { z = 1; }
		this.m34 !== 0 && (x !== y || x !== z || y !== z) && (this.is2D = false);
		return multiply(this, Scale(x, y, z))
	};
	CSSMatrix.prototype.rotate = function rotate (rx, ry, rz){
		if (ry == null) { ry = rx; }
		if (rz == null) { rz = rx; }
		this.m34 !== 0 && (rx || ry) && (this.is2D = false);
		return multiply(this, Rotate(rx, ry, rz))
	};
	CSSMatrix.prototype.rotateAxisAngle = function rotateAxisAngle (x, y, z, angle){
		this.m34 !== 0 && (x || y) && (this.is2D = false);
		if (y == null) { y = x; }
		if (z == null) { z = x; }
		return multiply(this, RotateAxisAngle(x, y, z, angle))
	};
	CSSMatrix.prototype.skewX = function skewX (angle){
		return multiply(this, SkewX(angle))
	};
	CSSMatrix.prototype.skewY = function skewY (angle){
		return multiply(this, SkewY(angle))
	};
	CSSMatrix.prototype.toString = function toString (){
		var m = this;
		if (m.is2D){
			return  'matrix(' + [
				m.a, m.b,
				m.c, m.d,
				m.e, m.f
			].join(', ') + ')';
		}
		return  'matrix3d(' + [
			m.m11, m.m12, m.m13, m.m14,
			m.m21, m.m22, m.m23, m.m24,
			m.m31, m.m32, m.m33, m.m34,
			m.m41, m.m42, m.m43, m.m44
		].join(', ') + ')'
	};
	CSSMatrix.prototype.setIdentity = function setIdentity (){
		var m = this;
		m.is2D = true;
		m.isIdentity = true;
		m.m11 = m.a = 1; m.m12 = m.b = 0; m.m13 = 0; m.m14 = 0;
		m.m21 = m.c = 0; m.m22 = m.d = 1; m.m23 = 0; m.m24 = 0;
		m.m31 = 0; m.m32 = 0; m.m33 = 1; m.m34 = 0;
		m.m41 = m.e = 0; m.m42 = m.f = 0; m.m43 = 0; m.m44 = 1;
		return this
	};

	return CSSMatrix;

})));
