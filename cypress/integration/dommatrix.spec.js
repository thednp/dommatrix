/// <reference types="cypress" />

// import CSSMatrix from '../instrumented/dommatrix';
import CSSMatrix from '../../src/dommatrix';
import testSamples from '../fixtures/testSamples';

describe('DOMMatrix Class Test', () => {

  beforeEach(() => {
    cy.visit('cypress/test.html')
      .get('body').then((body) => {
        cy.wrap(body[0]).as('body');
      })
      .get('.bg-primary').then((m) => {
        cy.wrap(m[0]).as('cssmatrix');
      })
      .get('.bg-secondary').then((m) => {
        cy.wrap(m[0]).as('dommatrix');
      })
      .wait(200);
  });

  it('Test init with invalid array, expect error', () => {
    const test = [0.906308, 0.0839613, -0.414194, 0.00103549, 0, 0.980067, 0.198669, -0.000496673, 0.422618, -0.180056, 0.888242, -0.0022206, 0, 0, 0, NaN];
    try {
      new CSSMatrix(test);
    } catch (err) {
      expect(err).to.be.instanceOf(TypeError);
      expect(err).to.have.property('message', `CSSMatrix: "${test}" must only have numbers.`);
    }

  });

  it('Test init with incomplete array, expect error', () => {
    const test = [0.906308, 0.0839613, -0.414194, 0.00103549, 0, 0.980067, 0.198669, -0.000496673, 0.422618, -0.180056, 0.888242, -0.0022206, 0, 0, 0];
    try {
      new CSSMatrix(test);
    } catch (err) {
      expect(err).to.be.instanceOf(TypeError);
      expect(err).to.have.property('message', 'CSSMatrix: expecting an Array of 6/16 values.');
    }
  });

  it('Test init with empty string, expect error', () => {
    try {
      new CSSMatrix('');
    } catch (err) {
      expect(err).to.be.instanceOf(TypeError);
      expect(err).to.have.property('message', 'CSSMatrix: expecting an Array of 6/16 values.');
    }
  });

  it('Test init with incomplete JSON object, expect error', () => {
    const test = '{"m11":1,"m12":0,"m13":0,"m14":0,"m21":0,"m22":1,"m23":0,"m24":0,"m31":0,"m32":0,"m33":1,"m34":0,"m41":10,"m42":10,"m43":0,"m44":1}';
    try {
      new CSSMatrix(JSON.parse(test));
    } catch (err) {
      expect(err).to.be.instanceOf(TypeError);
      expect(err).to.have.property('message', `CSSMatrix: "${test}" is not a DOMMatrix / CSSMatrix / JSON compatible object.`);
    } 
  });

  it('Test static methods', () => {
    const m = new CSSMatrix();
    const source = {a: 1};
    const source1 = 'wombat(1)';
    const source2 = 'skew()';
    const source3 = 'translate(wombat)';

    expect(CSSMatrix.fromMatrix(m)).to.deep.equal(m);
    expect(CSSMatrix.fromMatrix(m.toJSON())).to.deep.equal(m);

    try {
      CSSMatrix.fromString(source);
    } catch (err) {
      expect(err).to.be.instanceOf(TypeError);
      expect(err).to.have.property('message', `CSSMatrix: "${source}" is not a string.`);
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

  it('Test init with no parameter, expect same output as native DOMMatrix', () => {
    const css = new CSSMatrix();
    const dom = new DOMMatrix();
    expect(JSON.stringify(css)).to.equal(JSON.stringify(dom));
    expect(css.is2D).to.equal(dom.is2D);
    expect(css.isIdentity).to.equal(dom.isIdentity);
  });

  Object.keys(testSamples).forEach((test) => {
    it(`Test string input ${test}, expect same output as native DOMMatrix`, () => {
      const str = testSamples[test];
      const css = new CSSMatrix(str);
      const dom = new DOMMatrix(str);
      
      cy.get('@cssmatrix').then(($el) => {
        const [el] = $el.get();
        const str1 = css.toString();
        el.style.transform = str1;
      });
      cy.get('@dommatrix').then(($el) => {
        const [el] = $el.get();
        const str2 = dom.toString();
        el.style.transform = str2;
      });
      expect(css.is2D).to.equal(dom.is2D);
      expect(css.isIdentity).to.equal(dom.isIdentity);

              expect(Array.from(css.toFloat32Array()).map(x=> Math.floor(x * 10**6) / 10**6))
      .to.deep.equal(Array.from(dom.toFloat32Array()).map(x=> Math.floor(x * 10**6) / 10**6));

    });
  })


});