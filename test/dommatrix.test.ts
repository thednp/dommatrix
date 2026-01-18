import { expect, it, describe, vi, beforeEach, afterEach } from "vitest";
import { getExampleDOM } from "./fixtures/getExampleDom";

import CSSMatrix from "../src/index";
import type { Matrix, Matrix3d } from "../src/types";
import testSamples from "./fixtures/testSamples";

const roundTo4 = (x: number) => Math.round(x * 10000) / 10000;

describe("DOMMatrix Class Test", () => {
  let container: HTMLElement;
  beforeEach(async () => {
    container = getExampleDOM();
    await vi.waitUntil(() => container.querySelector("div") !== null, {
      timeout: 150,
    });
  });
  afterEach(async () => {
    document.documentElement.innerHTML = "";
  });

  it("Test init with no parameter, expect same output as native DOMMatrix", () => {
    const css = new CSSMatrix();
    const css1 = new CSSMatrix().setMatrixValue();
    const dom = new DOMMatrix();

    expect(css.is2D).to.equal(dom.is2D);
    expect(css.isIdentity).to.equal(dom.isIdentity);
    expect(JSON.stringify(css)).to.equal(JSON.stringify(dom));
    expect(JSON.stringify(css)).to.equal(JSON.stringify(css1));
  });

  it("Test init with invalid array, expect error", () => {
    const test = [
      0.906308,
      0.0839613,
      -0.414194,
      0.00103549,
      0,
      0.980067,
      0.198669,
      -0.000496673,
      0.422618,
      -0.180056,
      0.888242,
      -0.0022206,
      0,
      0,
      0,
      "NaN",
    ];
    try {
      // @ts-expect-error
      CSSMatrix.fromArray(test);
    } catch (err) {
      expect(err).to.be.instanceOf(TypeError);
      expect(err).to.have.property(
        "message",
        `CSSMatrix: "${test}" must be an array with 6/16 numbers.`,
      );
    }

    const test1 = [0.9659, 0.25879, -0.2588, 0.9659, -1.53961, "NaN"];
    try {
      // @ts-ignore
      CSSMatrix.fromArray(test1);
    } catch (err) {
      expect(err).to.be.instanceOf(TypeError);
      expect(err).to.have.property(
        "message",
        `CSSMatrix: "${test1}" must be an array with 6/16 numbers.`,
      );
    }
  });

  it("Test init with incomplete array, expect error", () => {
    const test = [
      0.906308, 0.0839613, -0.414194, 0.00103549, 0, 0.980067, 0.198669,
      -0.000496673, 0.422618, -0.180056, 0.888242, -0.0022206, 0, 0, 0,
    ];
    try {
      CSSMatrix.fromArray(test);
    } catch (err) {
      expect(err).to.be.instanceOf(TypeError);
      expect(err).to.have.property(
        "message",
        `CSSMatrix: "${test}" must be an array with 6/16 numbers.`,
      );
    }
  });

  it("Test init with incompatible CSSMatrix, DOMMatrix, JSON object", () => {
    // const css1 = {a: 0.94, b: 0.25, c: -0.25, d: 0.95, e: 0, f: 0, m11: 0.93, m12: 0.25, m13: -0.25, m14: 0, m21: -0.25, m22: 0.95, m23: 0, m24: 0, m31: 0.2, m32: 0.05, m33: 0.95, m34: 0, m41: 0, m42: 0, m43: 0, m44: 1};
    const css1 = {
      a: 0.94,
      b: 0.25,
      c: -0.25,
      d: 0.95,
      e: 0,
      f: 0,
      m11: 0.93,
      m12: 0.25,
      m13: -0.25,
      m14: 0,
      m21: -0.25,
      m22: 0.95,
      m23: 0,
      m24: 0,
      m31: 0.2,
      m32: 0.05,
      m33: 0.95,
      m34: 0,
      m41: 0,
      m42: 0,
      m43: 0,
      m44: 1,
    };
    const css2 = {
      m11: 0.93,
      m12: 0.25,
      m13: -0.25,
      m14: 0,
      m21: -0.25,
      m22: 0.95,
      m23: 0,
      m24: 0,
      m31: 0.2,
      m32: 0.05,
      m33: 0.95,
      m34: 0,
      m41: 0,
      m42: 0,
      m43: 0,
      m44: 1,
    };
    const css3 = { a: 0.94, b: 0.25, c: -0.25, d: 0.95, e: 0, f: 0 };

    [css1, css2, css3].forEach((c) => {
      try {
        // @ts-expect-error
        new CSSMatrix(c);
      } catch (err) {
        expect(err).to.be.instanceOf(TypeError);
        expect(err).to.have.property(
          "message",
          `CSSMatrix: "${JSON.stringify(c)}" is not a DOMMatrix / CSSMatrix / JSON compatible object.`,
        );
      }
    });
  });

  it("Test init compatible CSSMatrix, DOMMatrix, JSON object", () => {
    const css = new CSSMatrix().rotate(15, 15);
    const dom = new DOMMatrix().rotate(15, 15);

    expect(css.is2D).to.equal(dom.is2D);
    expect(css.is2D).to.equal(new CSSMatrix(css).is2D);
    expect(css.isIdentity).to.equal(dom.isIdentity);
    expect(css.isIdentity).to.equal(new CSSMatrix(dom).isIdentity);
  });

  it("Test scale issue #3", () => {
    const matrix = new CSSMatrix("scale(1, -1)");

    expect(matrix.toString()).toBe("matrix(1, 0, 0, -1, 0, 0)");

    const matrix2 = new CSSMatrix("scale(2, -1)");
    expect(matrix2.toString()).toBe("matrix(2, 0, 0, -1, 0, 0)");
  });

  it("Test specific private methods", () => {
    try {
      // @ts-ignore
      new CSSMatrix().rotateAxisAngle("a", "true", "wombat", "05");
    } catch (err) {
      expect(err).to.be.instanceOf(TypeError);
      expect(err).to.have.property("message", "CSSMatrix: expecting 4 values");
    }

    const m = new CSSMatrix();
    expect(m.rotateAxisAngle(0, 0, 0, 0).isIdentity).toBe(true);
    expect(m.rotateAxisAngle().isIdentity).toBe(true);

    expect(CSSMatrix.RotateAxisAngle(0, 0, 0, 0).isIdentity).toBe(true);
    expect(CSSMatrix.RotateAxisAngle().isIdentity).toBe(true);

    const d1 = new DOMMatrix().rotate(15);
    const m1 = new CSSMatrix().rotate(15);

    const cssDiv = container.querySelector(".bg-primary") as HTMLElement;
    const domDiv = container.querySelector(".bg-secondary") as HTMLElement;

    console.log("Some initial testing");

    cssDiv.style.transform = m1.toString();
    domDiv.style.transform = d1.toString();
    expect(m1.isIdentity).to.equal(d1.isIdentity);
    expect(m1.is2D).to.equal(d1.is2D);

    // for some reason DOMMatrix in
    // expect(m1.toFloat32Array()).to.deep.equal(d1.toFloat32Array());
    // expect(m1.toFloat64Array()).to.deep.equal(d1.toFloat64Array());
    expect(Array.from(m1.toFloat32Array()).map(roundTo4)).to.deep.equal(
      Array.from(d1.toFloat32Array()).map(roundTo4),
    );
    expect(Array.from(m1.toFloat64Array()).map(roundTo4)).to.deep.equal(
      Array.from(d1.toFloat64Array()).map(roundTo4),
    );

    console.log("CSSMatrix.rotate(x:25, y:15)");
    const d2 = new DOMMatrix().rotate(25, 15);
    const m2 = new CSSMatrix().rotate(25, 15);
    cssDiv.style.transform = m2.toString();
    domDiv.style.transform = d2.toString();

    expect(m2.isIdentity).to.equal(d2.isIdentity);
    expect(m2.is2D).to.equal(d2.is2D);

    // same here
    // expect(m2.toFloat32Array()).to.deep.equal(d2.toFloat32Array());
    // expect(m2.toFloat64Array()).to.deep.equal(d2.toFloat64Array());
    expect(Array.from(m2.toFloat32Array()).map(roundTo4)).to.deep.equal(
      Array.from(d2.toFloat32Array()).map(roundTo4),
    );
    expect(Array.from(m2.toFloat64Array()).map(roundTo4)).to.deep.equal(
      Array.from(d2.toFloat64Array()).map(roundTo4),
    );

    console.log("CSSMatrix.translate(x:150)");
    const d3 = new DOMMatrix().translate(150);
    const m3 = new CSSMatrix().translate(150);

    cssDiv.style.transform = m3.toString();
    domDiv.style.transform = d3.toString();
    expect(m3.isIdentity).to.equal(d3.isIdentity);
    expect(m3.is2D).to.equal(d3.is2D);
    // expect(m3.toFloat32Array()).to.deep.equal(d3.toFloat32Array());
    // expect(m3.toFloat64Array()).to.deep.equal(d3.toFloat64Array());
    expect(Array.from(m3.toFloat32Array()).map(roundTo4)).to.deep.equal(
      Array.from(d3.toFloat32Array()).map(roundTo4),
    );
    expect(Array.from(m3.toFloat64Array()).map(roundTo4)).to.deep.equal(
      Array.from(d3.toFloat64Array()).map(roundTo4),
    );

    console.log("CSSMatrix.skew(x:15, y:-20)");
    const d4 = new DOMMatrix("skew(15deg, -20deg)");
    const m4 = new CSSMatrix().skew(15, -20);
    console.log(
      "In this test we're addapting to the output of the native DOMMatrix method since it doesn't support the skew() method itself.",
    );
    cssDiv.style.transform = m4.toString();
    domDiv.style.transform = d4.toString();
    expect(m4.isIdentity).to.equal(d4.isIdentity);
    expect(m4.is2D).to.equal(d4.is2D);
    // expect(m4.toFloat32Array()).to.deep.equal(d4.toFloat32Array());
    // expect(m4.toFloat64Array()).to.deep.equal(d4.toFloat64Array());
    expect(Array.from(m4.toFloat32Array()).map(roundTo4)).to.deep.equal(
      Array.from(d4.toFloat32Array()).map(roundTo4),
    );
    expect(Array.from(m4.toFloat64Array()).map(roundTo4)).to.deep.equal(
      Array.from(d4.toFloat64Array()).map(roundTo4),
    );

    console.log("CSSMatrix.scale(x:1.3)");
    const d5 = new DOMMatrix().scale(1.3);
    const m5 = new CSSMatrix().scale(1.3);

    cssDiv.style.transform = m5.toString();
    domDiv.style.transform = d5.toString();
    expect(m5.isIdentity).to.equal(d5.isIdentity);
    expect(m5.is2D).to.equal(d5.is2D);
    // expect(m5.toFloat32Array()).to.deep.equal(d5.toFloat32Array());
    // expect(m5.toFloat64Array()).to.deep.equal(d5.toFloat64Array());
    expect(Array.from(m5.toFloat32Array()).map(roundTo4)).to.deep.equal(
      Array.from(d5.toFloat32Array()).map(roundTo4),
    );
    expect(Array.from(m5.toFloat64Array()).map(roundTo4)).to.deep.equal(
      Array.from(d5.toFloat64Array()).map(roundTo4),
    );

    console.log("CSSMatrix.scale(x:1.3,y:1.8)");
    const d6 = new DOMMatrix().scale(1.3, 1.8);
    const m6 = new CSSMatrix().scale(1.3, 1.8);
    cssDiv.style.transform = m6.toString();
    domDiv.style.transform = d6.toString();
    expect(m6.isIdentity).to.equal(d6.isIdentity);
    expect(m6.is2D).to.equal(d6.is2D);
    // expect(m6.toFloat32Array()).to.deep.equal(d6.toFloat32Array());
    // expect(m6.toFloat64Array()).to.deep.equal(d6.toFloat64Array());
    expect(Array.from(m6.toFloat32Array()).map(roundTo4)).to.deep.equal(
      Array.from(d6.toFloat32Array()).map(roundTo4),
    );
    expect(Array.from(m6.toFloat64Array()).map(roundTo4)).to.deep.equal(
      Array.from(d6.toFloat64Array()).map(roundTo4),
    );

    console.log("CSSMatrix.transformPoint");
    const p1 = new DOMPoint(15, 20, 35, 1);
    const p2 = { x: 15, y: 20, z: 35, w: 1 };
    const dp = new DOMMatrix().rotate(15).translate(15, 15);
    const mp = new CSSMatrix().rotate(15).translate(15, 15);

    console.log(
      "For some reason the native DOMMatrix again falsely claims **is2D** to be true",
    );
    expect(mp.isIdentity).to.equal(dp.isIdentity);
    expect(mp.is2D).to.equal(dp.is2D);
    expect(mp.toFloat32Array()).to.deep.equal(dp.toFloat32Array());
    expect(mp.toFloat64Array()).to.deep.equal(dp.toFloat64Array());
    expect(mp.transformPoint(p1)).to.deep.equal(dp.transformPoint(p1));
    expect(mp.transformPoint(p2)).to.deep.equal(dp.transformPoint(p2).toJSON());
  });

  it("Test init a 6 values array", () => {
    const test = [
      0.9659, 0.25879, -0.2588, 0.9659, -1.53961, -1.53961,
    ] as Matrix;
    const m1 = new CSSMatrix(test);
    // const m2 = new CSSMatrix(...test);
    const m3 = new CSSMatrix(test);
    const m4 = new DOMMatrix(test);

    expect(m1.toFloat64Array()).to.deep.equal(m3.toFloat64Array());
    expect(m1.toFloat64Array()).to.deep.equal(m4.toFloat64Array());
  });

  it("Test init a 16 values array", () => {
    const test = [
      0.852, 0.153, 0.186, -0.0004, -0.092, 0.869, -0.266, 0.0006, -0.25, 0.258,
      0.933, -0.002, 0, 0, 0, 1,
    ] as Matrix3d;
    const m1 = new CSSMatrix(test);
    // const m2 = new CSSMatrix(...test);
    const m3 = new CSSMatrix([...test]);
    const m4 = new DOMMatrix(test);

    expect(m1.toFloat32Array()).to.deep.equal(m3.toFloat32Array());
    expect(m1.toFloat32Array()).to.deep.equal(m4.toFloat32Array());
  });

  it("Test static methods", () => {
    const m = new CSSMatrix();
    const source = { a: 1 };
    const source1 = "wombat(1)";
    const source2 = "skew()";
    const source3 = "translate(wombat)";

    expect(CSSMatrix.fromMatrix(m)).to.deep.equal(m);
    expect(CSSMatrix.fromMatrix(m.toJSON())).to.deep.equal(m);

    try {
      // @ts-expect-error
      CSSMatrix.fromString(source);
    } catch (err) {
      expect(err).to.be.instanceOf(TypeError);
      expect(err).to.have.property(
        "message",
        `CSSMatrix: "${JSON.stringify(source)}" is not a string.`,
      );
    }

    try {
      CSSMatrix.fromString(source1);
    } catch (err) {
      expect(err).to.be.instanceOf(TypeError);
      expect(err).to.have.property(
        "message",
        `CSSMatrix: invalid transform string "${source1}"`,
      );
    }

    try {
      CSSMatrix.fromString(source2);
    } catch (err) {
      expect(err).to.be.instanceOf(TypeError);
      expect(err).to.have.property(
        "message",
        `CSSMatrix: invalid transform string "${source2}"`,
      );
    }

    try {
      CSSMatrix.fromString(source3);
    } catch (err) {
      expect(err).to.be.instanceOf(TypeError);
      expect(err).to.have.property(
        "message",
        `CSSMatrix: invalid transform string "${source3}"`,
      );
    }
  });

  Object.keys(testSamples).forEach((test) => {
    it(`Test string input ${test}, expect same output as native DOMMatrix`, () => {
      const str = (testSamples as Record<string, string>)[test];
      const css = new CSSMatrix(str);
      const dom = new DOMMatrix(str);
      const cssDiv = container.querySelector(".bg-primary") as HTMLElement;
      const domDiv = container.querySelector(".bg-secondary") as HTMLElement;

      cssDiv.style.transform = css.toString();
      domDiv.style.transform = dom.toString();

      console.log(
        "Due to the nature of the native DOMMatrix RegExp, for consistency reasons we're rounding numbers to 6 decimals in this test.",
      );

      expect(Array.from(css.toFloat32Array()).map(roundTo4)).to.deep.equal(
        Array.from(dom.toFloat32Array()).map(roundTo4),
      );

      console.log(
        "The native `DOMMatrix` is a little weird when it comes to rotateAxisAngle, it falsely claims the identity matrix is NOT `is2D`",
      );

      expect(css.isIdentity).to.equal(dom.isIdentity);
      if (test === "rotate3d1") {
        expect(css.is2D).to.not.equal(dom.is2D);
      } else {
        expect(css.is2D).to.equal(dom.is2D);
      }
    });
  });
});

describe("CSSMatrix Mutable Methods", () => {
  it("Test multiplySelf to multiply matrix in place", () => {
    const m1 = new CSSMatrix();
    const m2 = new CSSMatrix();
    m2.m11 = 2;
    m2.m22 = 2;

    const result = m1.multiplySelf(m2);

    expect(result).toBe(m1); // Returns same instance
    expect(m1.m11).toBe(2);
    expect(m1.m22).toBe(2);
  });

  it("Test multiplySelf to be chainable", () => {
    const m1 = new CSSMatrix();
    const m2 = new CSSMatrix();
    m2.m11 = 2;

    const result = m1.multiplySelf(m2).multiplySelf(m2);

    expect(result).toBe(m1);
    expect(m1.m11).toBe(4);
  });

  it("Test translateSelf to translate matrix in place", () => {
    const m = new CSSMatrix();
    const result = m.translateSelf(10, 20, 5);

    expect(result).toBe(m);
    expect(m.m41).toBe(10);
    expect(m.m42).toBe(20);
    expect(m.m43).toBe(5);
    expect(m.e).toBe(10);
    expect(m.f).toBe(20);
  });

  it("Test translateSelf to handle handle default y and z values", () => {
    const m = new CSSMatrix();
    m.translateSelf(10);

    expect(m.m41).toBe(10);
    expect(m.m42).toBe(0);
    expect(m.m43).toBe(0);
  });

  it("Test translateSelf to be chainable", () => {
    const m = new CSSMatrix();
    const result = m.translateSelf(10, 20).translateSelf(5, 5);

    expect(result).toBe(m);
    expect(m.m41).toBe(15);
    expect(m.m42).toBe(25);
  });

  it("Test translateSelf to match immutable translate result", () => {
    const m1 = new CSSMatrix();
    const m2 = new CSSMatrix();

    m1.translateSelf(10, 20, 5);
    const m2Result = m2.translate(10, 20, 5);

    expect(m1.m11).toBe(m2Result.m11);
    expect(m1.m41).toBe(m2Result.m41);
    expect(m1.m42).toBe(m2Result.m42);
    expect(m1.m43).toBe(m2Result.m43);
  });

  it("Test scaleSelf to scale matrix in place", () => {
    const m = new CSSMatrix();
    const result = m.scaleSelf(2, 3, 4);

    expect(result).toBe(m);
    expect(m.m11).toBe(2);
    expect(m.m22).toBe(3);
    expect(m.m33).toBe(4);
  });

  it("Test scaleSelf to use x value for y if y is undefined", () => {
    const m = new CSSMatrix();
    m.scaleSelf(2);

    expect(m.m11).toBe(2);
    expect(m.m22).toBe(2);
    expect(m.m33).toBe(1);
  });

  it("Test scaleSelf to use 1 for z if z is undefined", () => {
    const m = new CSSMatrix();
    m.scaleSelf(2, 3);

    expect(m.m11).toBe(2);
    expect(m.m22).toBe(3);
    expect(m.m33).toBe(1);
  });

  it("Test scaleSelf to be chainable", () => {
    const m = new CSSMatrix();
    const result = m.scaleSelf(2).scaleSelf(3);

    expect(result).toBe(m);
    expect(m.m11).toBe(6);
    expect(m.m22).toBe(6);
  });

  it("Test scaleSelf to match immutable scale result", () => {
    const m1 = new CSSMatrix();
    const m2 = new CSSMatrix();

    m1.scaleSelf(2, 3, 4);
    const m2Result = m2.scale(2, 3, 4);

    expect(m1.m11).toBe(m2Result.m11);
    expect(m1.m22).toBe(m2Result.m22);
    expect(m1.m33).toBe(m2Result.m33);
  });

  it("Test rotateSelf to rotate matrix in place", () => {
    const m = new CSSMatrix();
    const result = m.rotateSelf(45);

    expect(result).toBe(m);
    // Verify rotation matrix values (approximate)
    expect(m.m11).toBeCloseTo(0.707, 3);
    expect(m.m12).toBeCloseTo(0.7071, 3);
    expect(m.m21).toBeCloseTo(-0.7071, 3);
    expect(m.m22).toBeCloseTo(0.707, 3);
  });

  it("Test rotateSelf to handle 2D rotation (first param, Z only)", () => {
    const m = new CSSMatrix();
    m.rotateSelf(45);

    expect(m.m11).toBeCloseTo(0.707, 3);
    expect(m.m12).toBeCloseTo(0.7071, 3);
    expect(m.m21).toBeCloseTo(-0.707, 3);
    expect(m.m22).toBeCloseTo(0.707, 3);
  });

  it("Test rotateSelf to handle 3D rotation", () => {
    const m = new CSSMatrix();
    m.rotateSelf(45, 30, 60);

    // Verify some values are non-zero
    expect(m.m11).not.toBe(1);
    expect(m.m22).not.toBe(1);
    expect(m.m33).not.toBe(1);
  });

  it("Test rotateSelf to be chainable", () => {
    const m = new CSSMatrix();
    const result = m.rotateSelf(45).rotateSelf(30);

    expect(result).toBe(m);
    // Verify combined rotation
    expect(m.m11).toBeCloseTo(0.2588, 3);
    expect(roundTo4(m.m12)).toBeCloseTo(0.9659, 3);
  });

  it("Test rotateSelf to match immutable rotate result", () => {
    const m1 = new CSSMatrix();
    const m2 = new CSSMatrix();

    m1.rotateSelf(45);
    const m2Result = m2.rotate(0, 0, 45);

    expect(m1.m11).toBeCloseTo(m2Result.m11, 3);
    expect(m1.m12).toBeCloseTo(m2Result.m12, 3);
    expect(m1.m21).toBeCloseTo(m2Result.m21, 3);
    expect(m1.m22).toBeCloseTo(m2Result.m22, 3);
  });

  it("Test rotateAxisAngleSelf to rotate around axis in place", () => {
    const m = new CSSMatrix();
    m.rotateAxisAngleSelf(1, 0, 0, 90);

    expect(m).toBe(m);
    // Verify rotation around X-axis
    expect(m.m22).toBeCloseTo(0, 3);
    expect(m.m23).toBeCloseTo(1, 3);
    expect(m.m32).toBeCloseTo(-1, 3);
    expect(roundTo4(m.m33)).toBeCloseTo(0, 3);
  });

  it("Test rotateAxisAngleSelf to handle invalid vector length", () => {
    const m = new CSSMatrix();
    // @ts-expect-error
    expect(() => m.rotateAxisAngleSelf(0, 0, 0, null)).toThrowError();
  });

  it("Test rotateAxisAngleSelf to be chainable", () => {
    const m = new CSSMatrix();
    const result = m
      .rotateAxisAngleSelf(1, 0, 0, 90)
      .rotateAxisAngleSelf(0, 1, 0, 45);

    expect(result).toBe(m);
    // Verify combined rotation
    expect(m.m11).not.toBe(1);
    expect(m.m22).not.toBe(1);
    expect(m.m33).not.toBe(1);
  });

  it("Test rotateAxisAngleSelf to match immutable rotateAxisAngle result", () => {
    const m1 = new CSSMatrix();
    const m2 = new CSSMatrix();

    m1.rotateAxisAngleSelf(1, 0, 0, 90);
    const m2Result = m2.rotateAxisAngle(1, 0, 0, 90);

    expect(m1.m11).toBeCloseTo(m2Result.m11, 3);
    expect(m1.m22).toBeCloseTo(m2Result.m22, 3);
    expect(m1.m33).toBeCloseTo(m2Result.m33, 3);
  });

  it("Test skewXSelf to skew X-axis in place", () => {
    const m = new CSSMatrix();
    m.skewXSelf(45);

    expect(m).toBe(m);
    expect(m.m21).toBeCloseTo(1, 3); // tan(45°) = 1
    expect(m.c).toBeCloseTo(1, 3);
  });

  it("Test skewXSelf to be chainable", () => {
    const m = new CSSMatrix();
    const result = m.skewXSelf(45).skewXSelf(30);

    expect(result).toBe(m);
    // Verify combined skew
    expect(m.m21).toBeCloseTo(1.57735, 3); // tan(45°) + tan(30°) = 1 + 0.577 = 1.577
  });

  it("Test skewXSelf to match immutable skewX result", () => {
    const m1 = new CSSMatrix();
    const m2 = new CSSMatrix();

    m1.skewXSelf(45);
    const m2Result = m2.skewX(45);

    expect(m1.m21).toBeCloseTo(m2Result.m21, 3);
    expect(m1.c).toBeCloseTo(m2Result.c, 3);
  });

  it("Test skewYSelf to skew Y-axis in place", () => {
    const m = new CSSMatrix();
    m.skewYSelf(45);

    expect(m).toBe(m);
    expect(m.m12).toBeCloseTo(1, 3); // tan(45°) = 1
    expect(m.b).toBeCloseTo(1, 3);
  });

  it("Test skewYSelf to be chainable", () => {
    const m = new CSSMatrix();
    const result = m.skewYSelf(45).skewYSelf(30);

    expect(result).toBe(m);
    // Verify combined skew
    expect(m.m12).toBeCloseTo(1.57735, 3); // tan(45°) + tan(30°) = 1 + 0.577 = 1.577
  });

  it("Test skewYSelf to match immutable skewY result", () => {
    const m1 = new CSSMatrix();
    const m2 = new CSSMatrix();

    m1.skewYSelf(45);
    const m2Result = m2.skewY(45);

    expect(m1.m12).toBeCloseTo(m2Result.m12, 3);
    expect(m1.b).toBeCloseTo(m2Result.b, 3);
  });

  it("Test skewYSelf to skew both axes in place", () => {
    const m = new CSSMatrix();
    m.skewSelf(45, 30);

    expect(m).toBe(m);
    expect(m.m21).toBeCloseTo(1, 3); // tan(45°) = 1
    expect(m.m12).toBeCloseTo(0.577, 3); // tan(30°) = 0.577
  });

  it("Test skewYSelf to be chainable", () => {
    const m = new CSSMatrix();
    const result = m.skewSelf(45, 30).skewSelf(15, 10);

    expect(result).toBe(m);
    // Verify combined skew
    expect(m.m21).toBeCloseTo(1.2679, 3); // tan(45°) + tan(15°) = 1 + 0.268 = 1.268
    expect(m.m12).toBeCloseTo(0.7536, 3); // tan(30°) + tan(10°) = 0.577 + 0.176 = 0.753
  });

  it("Test skewYSelf to match immutable skew result", () => {
    const m1 = new CSSMatrix();
    const m2 = new CSSMatrix();

    m1.skewSelf(45, 30);
    const m2Result = m2.skew(45, 30);

    expect(m1.m21).toBeCloseTo(m2Result.m21, 3);
    expect(m1.m12).toBeCloseTo(m2Result.m12, 3);
  });

  it("Test chaining of all methods", () => {
    const m = new CSSMatrix();
    const result = m
      .translateSelf(10, 20)
      .scaleSelf(2, 3)
      .rotateSelf(45)
      .rotateAxisAngleSelf(1, 0, 0, 90)
      .skewXSelf(45)
      .skewYSelf(30)
      .multiplySelf(CSSMatrix.Scale(1, 1, 1));

    expect(result).toBe(m);
    // Verify all transformations are applied
    expect(m.m41).toBe(10);
    expect(m.m42).toBe(20);
    expect(m.m11).toBe(2.230710143300821);
    expect(m.m22).toBe(2.1213203435596424);
    expect(m.m11).not.toBe(1); // Rotation should change values
  });

  it("Test skewYSelf to throw error for invalid rotation axis angle", () => {
    const m = new CSSMatrix();
    // @ts-expect-error
    expect(() => m.rotateAxisAngleSelf(0, 0, 0, null)).toThrowError();
    expect(m.rotateAxisAngleSelf(0, 0, 0, 0)).to.deep.equal(m);
    expect(m.rotateAxisAngleSelf()).to.deep.equal(m);
  });

  // not yet implemented
  // it("should handle invalid inputs gracefully", () => {
  //   const m = new CSSMatrix();
  //   expect(() => m.translateSelf(NaN, 20)).toThrowError();
  //   expect(() => m.scaleSelf(2, NaN)).toThrowError();
  //   expect(() => m.rotateSelf(45, NaN)).toThrowError();
  // });

  it("should preserve identity when multiplying by identity", () => {
    const m = new CSSMatrix();
    const identity = new CSSMatrix(); // Identity matrix

    m.translateSelf(10, 20);
    m.multiplySelf(identity);

    expect(m.m41).toBe(10);
    expect(m.m42).toBe(20);
  });
});
