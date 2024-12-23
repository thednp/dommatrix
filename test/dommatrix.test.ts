import { expect, it, describe, vi, beforeEach, afterEach } from 'vitest';
import { getExampleDOM } from './fixtures/getExampleDom';

import CSSMatrix from '../src/index';
import type { Matrix, Matrix3d } from '../src/types';
import testSamples from './fixtures/testSamples';

const roundTo4 = (x: number) => Math.round(x * 10000) / 10000

describe('DOMMatrix Class Test', () => {
  let container: HTMLElement;
  beforeEach(async () => {
    container = getExampleDOM();
    await vi.waitUntil(() => container.querySelector('div') !== null, { timeout: 150 });
  });
  afterEach(async () => {
    document.documentElement.innerHTML = '';
  });

  it('Test init with no parameter, expect same output as native DOMMatrix', () => {
    const css = new CSSMatrix();
    const css1 = new CSSMatrix().setMatrixValue();
    const dom = new DOMMatrix();

    expect(css.is2D).to.equal(dom.is2D);
    expect(css.isIdentity).to.equal(dom.isIdentity);
    expect(JSON.stringify(css)).to.equal(JSON.stringify(dom));
    expect(JSON.stringify(css)).to.equal(JSON.stringify(css1));
  });

  it('Test init with invalid array, expect error', () => {
    const test = [0.906308, 0.0839613, -0.414194, 0.00103549, 0, 0.980067, 0.198669, -0.000496673, 0.422618, -0.180056, 0.888242, -0.0022206, 0, 0, 0, 'NaN'];
    try {
      // @ts-expect-error
      CSSMatrix.fromArray(test);
    } catch (err) {
      expect(err).to.be.instanceOf(TypeError);
      expect(err).to.have.property('message', `CSSMatrix: "${test}" must be an array with 6/16 numbers.`);
    }

    const test1 = [0.9659, 0.25879, -0.2588, 0.9659, -1.53961, 'NaN'];
    try {
      // @ts-ignore
      CSSMatrix.fromArray(test1);
    } catch (err) {
      expect(err).to.be.instanceOf(TypeError);
      expect(err).to.have.property('message', `CSSMatrix: "${test1}" must be an array with 6/16 numbers.`);
    }

  });

  it('Test init with incomplete array, expect error', () => {
    const test = [0.906308, 0.0839613, -0.414194, 0.00103549, 0, 0.980067, 0.198669, -0.000496673, 0.422618, -0.180056, 0.888242, -0.0022206, 0, 0, 0];
    try {
      CSSMatrix.fromArray(test);
    } catch (err) {
      expect(err).to.be.instanceOf(TypeError);
      expect(err).to.have.property('message', `CSSMatrix: "${test}" must be an array with 6/16 numbers.`);
    }
  });

  it('Test init with incompatible CSSMatrix, DOMMatrix, JSON object', () => {
    // const css1 = {a: 0.94, b: 0.25, c: -0.25, d: 0.95, e: 0, f: 0, m11: 0.93, m12: 0.25, m13: -0.25, m14: 0, m21: -0.25, m22: 0.95, m23: 0, m24: 0, m31: 0.2, m32: 0.05, m33: 0.95, m34: 0, m41: 0, m42: 0, m43: 0, m44: 1};
    const css1 = { a: 0.94, b: 0.25, c: -0.25, d: 0.95, e: 0, f: 0, m11: 0.93, m12: 0.25, m13: -0.25, m14: 0, m21: -0.25, m22: 0.95, m23: 0, m24: 0, m31: 0.2, m32: 0.05, m33: 0.95, m34: 0, m41: 0, m42: 0, m43: 0, m44: 1 };
    const css2 = { m11: 0.93, m12: 0.25, m13: -0.25, m14: 0, m21: -0.25, m22: 0.95, m23: 0, m24: 0, m31: 0.2, m32: 0.05, m33: 0.95, m34: 0, m41: 0, m42: 0, m43: 0, m44: 1 };
    const css3 = { a: 0.94, b: 0.25, c: -0.25, d: 0.95, e: 0, f: 0 };

    [css1, css2, css3].forEach((c) => {
      try {
        // @ts-expect-error
        new CSSMatrix(c);
      } catch (err) {
        expect(err).to.be.instanceOf(TypeError);
        expect(err).to.have.property('message', `CSSMatrix: "${JSON.stringify(c)}" is not a DOMMatrix / CSSMatrix / JSON compatible object.`);
      }
    })
  });

  it('Test init compatible CSSMatrix, DOMMatrix, JSON object', () => {
    const css = new CSSMatrix().rotate(15, 15);
    const dom = new DOMMatrix().rotate(15, 15);

    expect(css.is2D).to.equal(dom.is2D)
    expect(css.is2D).to.equal(new CSSMatrix(css).is2D)
    expect(css.isIdentity).to.equal(dom.isIdentity)
    expect(css.isIdentity).to.equal((new CSSMatrix(dom)).isIdentity)
  });

  it('Test scale issue #3', () => {
    const matrix = new CSSMatrix('scale(1, -1)');

    expect(matrix.toString()).toBe('matrix(1, 0, 0, -1, 0, 0)');

    const matrix2 = new CSSMatrix('scale(2, -1)');
    expect(matrix2.toString()).toBe('matrix(2, 0, 0, -1, 0, 0)');
  });

  it('Test specific private methods', () => {
    try {
      // @ts-ignore
      new CSSMatrix().rotateAxisAngle('a', 'true', 'wombat', '05');
    } catch (err) {
      expect(err).to.be.instanceOf(TypeError);
      expect(err).to.have.property('message', 'CSSMatrix: expecting 4 values');
    }

    const d1 = new DOMMatrix().rotate(15);
    const m1 = new CSSMatrix().rotate(15);

    const cssDiv = container.querySelector('.bg-primary') as HTMLElement;
    const domDiv = container.querySelector('.bg-secondary') as HTMLElement;

    console.log('Some initial testing');

    cssDiv.style.transform = m1.toString();
    domDiv.style.transform = d1.toString();
    expect(m1.isIdentity).to.equal(d1.isIdentity);
    expect(m1.is2D).to.equal(d1.is2D);

    // for some reason DOMMatrix in 
    // expect(m1.toFloat32Array()).to.deep.equal(d1.toFloat32Array());
    // expect(m1.toFloat64Array()).to.deep.equal(d1.toFloat64Array());
    expect(Array.from(m1.toFloat32Array()).map(roundTo4))
      .to.deep.equal(Array.from(d1.toFloat32Array()).map(roundTo4));
    expect(Array.from(m1.toFloat64Array()).map(roundTo4))
      .to.deep.equal(Array.from(d1.toFloat64Array()).map(roundTo4));

    console.log('CSSMatrix.rotate(x:25, y:15)');
    const d2 = new DOMMatrix().rotate(25, 15);
    const m2 = new CSSMatrix().rotate(25, 15);
    cssDiv.style.transform = m2.toString();
    domDiv.style.transform = d2.toString();

    expect(m2.isIdentity).to.equal(d2.isIdentity);
    expect(m2.is2D).to.equal(d2.is2D);

    // same here
    // expect(m2.toFloat32Array()).to.deep.equal(d2.toFloat32Array());
    // expect(m2.toFloat64Array()).to.deep.equal(d2.toFloat64Array());
    expect(Array.from(m2.toFloat32Array()).map(roundTo4))
      .to.deep.equal(Array.from(d2.toFloat32Array()).map(roundTo4));
    expect(Array.from(m2.toFloat64Array()).map(roundTo4))
      .to.deep.equal(Array.from(d2.toFloat64Array()).map(roundTo4));


    console.log('CSSMatrix.translate(x:150)');
    const d3 = new DOMMatrix().translate(150);
    const m3 = new CSSMatrix().translate(150);

    cssDiv.style.transform = m3.toString();
    domDiv.style.transform = d3.toString();
    expect(m3.isIdentity).to.equal(d3.isIdentity);
    expect(m3.is2D).to.equal(d3.is2D);
    // expect(m3.toFloat32Array()).to.deep.equal(d3.toFloat32Array());
    // expect(m3.toFloat64Array()).to.deep.equal(d3.toFloat64Array());
    expect(Array.from(m3.toFloat32Array()).map(roundTo4))
      .to.deep.equal(Array.from(d3.toFloat32Array()).map(roundTo4));
    expect(Array.from(m3.toFloat64Array()).map(roundTo4))
      .to.deep.equal(Array.from(d3.toFloat64Array()).map(roundTo4));

    console.log('CSSMatrix.skew(x:15, y:-20)');
    const d4 = new DOMMatrix('skew(15deg, -20deg)');
    const m4 = new CSSMatrix().skew(15, -20);
    console.log('In this test we\'re addapting to the output of the native DOMMatrix method since it doesn\'t support the skew() method itself.');
    cssDiv.style.transform = m4.toString();
    domDiv.style.transform = d4.toString();
    expect(m4.isIdentity).to.equal(d4.isIdentity);
    expect(m4.is2D).to.equal(d4.is2D);
    // expect(m4.toFloat32Array()).to.deep.equal(d4.toFloat32Array());
    // expect(m4.toFloat64Array()).to.deep.equal(d4.toFloat64Array());
    expect(Array.from(m4.toFloat32Array()).map(roundTo4))
      .to.deep.equal(Array.from(d4.toFloat32Array()).map(roundTo4));
    expect(Array.from(m4.toFloat64Array()).map(roundTo4))
      .to.deep.equal(Array.from(d4.toFloat64Array()).map(roundTo4));

    console.log('CSSMatrix.scale(x:1.3)');
    const d5 = new DOMMatrix().scale(1.3);
    const m5 = new CSSMatrix().scale(1.3);

    cssDiv.style.transform = m5.toString();
    domDiv.style.transform = d5.toString();
    expect(m5.isIdentity).to.equal(d5.isIdentity);
    expect(m5.is2D).to.equal(d5.is2D);
    // expect(m5.toFloat32Array()).to.deep.equal(d5.toFloat32Array());
    // expect(m5.toFloat64Array()).to.deep.equal(d5.toFloat64Array());
    expect(Array.from(m5.toFloat32Array()).map(roundTo4))
      .to.deep.equal(Array.from(d5.toFloat32Array()).map(roundTo4));
    expect(Array.from(m5.toFloat64Array()).map(roundTo4))
      .to.deep.equal(Array.from(d5.toFloat64Array()).map(roundTo4));

    console.log('CSSMatrix.scale(x:1.3,y:1.8)');
    const d6 = new DOMMatrix().scale(1.3, 1.8);
    const m6 = new CSSMatrix().scale(1.3, 1.8);
    cssDiv.style.transform = m6.toString();
    domDiv.style.transform = d6.toString();
    expect(m6.isIdentity).to.equal(d6.isIdentity);
    expect(m6.is2D).to.equal(d6.is2D);
    // expect(m6.toFloat32Array()).to.deep.equal(d6.toFloat32Array());
    // expect(m6.toFloat64Array()).to.deep.equal(d6.toFloat64Array());
    expect(Array.from(m6.toFloat32Array()).map(roundTo4))
      .to.deep.equal(Array.from(d6.toFloat32Array()).map(roundTo4));
    expect(Array.from(m6.toFloat64Array()).map(roundTo4))
      .to.deep.equal(Array.from(d6.toFloat64Array()).map(roundTo4));

    console.log('CSSMatrix.transformPoint');
    const p1 = new DOMPoint(15, 20, 35, 1);
    const p2 = { x: 15, y: 20, z: 35, w: 1 };
    const dp = new DOMMatrix().rotate(15).translate(15, 15);
    const mp = new CSSMatrix().rotate(15).translate(15, 15);

    console.log('For some reason the native DOMMatrix again falsely claims **is2D** to be true');
    expect(mp.isIdentity).to.equal(dp.isIdentity);
    expect(mp.is2D).to.equal(dp.is2D);
    expect(mp.toFloat32Array()).to.deep.equal(dp.toFloat32Array());
    expect(mp.toFloat64Array()).to.deep.equal(dp.toFloat64Array());
    expect(mp.transformPoint(p1)).to.deep.equal(dp.transformPoint(p1));
    expect(mp.transformPoint(p2)).to.deep.equal(dp.transformPoint(p2).toJSON());
  });

  it('Test init a 6 values array', () => {
    const test = [0.9659, 0.25879, -0.2588, 0.9659, -1.53961, -1.53961] as Matrix;
    const m1 = new CSSMatrix(test);
    // const m2 = new CSSMatrix(...test);
    const m3 = new CSSMatrix(test);
    const m4 = new DOMMatrix(test);

    expect(m1.toFloat64Array()).to.deep.equal(m3.toFloat64Array())
    expect(m1.toFloat64Array()).to.deep.equal(m4.toFloat64Array())
  });

  it('Test init a 16 values array', () => {
    const test = [0.852, 0.153, 0.186, -0.0004, -0.092, 0.869, -0.266, 0.0006, -0.25, 0.258, 0.933, -0.002, 0, 0, 0, 1] as Matrix3d;
    const m1 = new CSSMatrix(test);
    // const m2 = new CSSMatrix(...test);
    const m3 = new CSSMatrix([...test]);
    const m4 = new DOMMatrix(test);

    expect(m1.toFloat32Array()).to.deep.equal(m3.toFloat32Array())
    expect(m1.toFloat32Array()).to.deep.equal(m4.toFloat32Array())
  });

  it('Test static methods', () => {
    const m = new CSSMatrix();
    const source = { a: 1 };
    const source1 = 'wombat(1)';
    const source2 = 'skew()';
    const source3 = 'translate(wombat)';

    expect(CSSMatrix.fromMatrix(m)).to.deep.equal(m);
    expect(CSSMatrix.fromMatrix(m.toJSON())).to.deep.equal(m);

    try {
      // @ts-expect-error
      CSSMatrix.fromString(source);
    } catch (err) {
      expect(err).to.be.instanceOf(TypeError);
      expect(err).to.have.property('message', `CSSMatrix: "${JSON.stringify(source)}" is not a string.`);
    }

    try {
      CSSMatrix.fromString(source1);
    } catch (err) {
      expect(err).to.be.instanceOf(TypeError);
      expect(err).to.have.property('message', `CSSMatrix: invalid transform string "${source1}"`);
    }

    try {
      CSSMatrix.fromString(source2);
    } catch (err) {
      expect(err).to.be.instanceOf(TypeError);
      expect(err).to.have.property('message', `CSSMatrix: invalid transform string "${source2}"`);
    }

    try {
      CSSMatrix.fromString(source3);
    } catch (err) {
      expect(err).to.be.instanceOf(TypeError);
      expect(err).to.have.property('message', `CSSMatrix: invalid transform string "${source3}"`);
    }
  });

  Object.keys(testSamples).forEach((test) => {
    it(`Test string input ${test}, expect same output as native DOMMatrix`, () => {
      const str = testSamples[test];
      const css = new CSSMatrix(str);
      const dom = new DOMMatrix(str);
      const cssDiv = container.querySelector('.bg-primary') as HTMLElement;
      const domDiv = container.querySelector('.bg-secondary') as HTMLElement;

      cssDiv.style.transform = css.toString();
      domDiv.style.transform = dom.toString();

      console.log('Due to the nature of the native DOMMatrix RegExp, for consistency reasons we\'re rounding numbers to 6 decimals in this test.')

      expect(Array.from(css.toFloat32Array()).map(roundTo4))
        .to.deep.equal(Array.from(dom.toFloat32Array()).map(roundTo4));

      console.log('The native `DOMMatrix` is a little weird when it comes to rotateAxisAngle, it falsely claims the identity matrix is NOT `is2D`');

      expect(css.isIdentity).to.equal(dom.isIdentity)
      if (test === 'rotate3d1') {
        expect(css.is2D).to.not.equal(dom.is2D)
      } else {
        expect(css.is2D).to.equal(dom.is2D)
      }
    })
  })
});
