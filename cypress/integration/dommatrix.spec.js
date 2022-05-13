/// <reference types="cypress" />

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
      .log('These tests compare CSSMatrix methods agains the native DOMMatrix.');
  });

  it('Test init with no parameter, expect same output as native DOMMatrix', () => {
    const css = new CSSMatrix();
    const dom = new DOMMatrix();
    cy.wrap(css).as('css')
      .get('@css').its('is2D').should('equal', dom.is2D)
      .get('@css').its('isIdentity').should('equal', dom.isIdentity)
      .get('@css').should(($this) => {
        expect(JSON.stringify($this)).to.equal(JSON.stringify(dom));
      })
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

  it('Test init with incompatible CSSMatrix, DOMMatrix, JSON object', () => {
    // const css1 = {a: 0.94, b: 0.25, c: -0.25, d: 0.95, e: 0, f: 0, m11: 0.93, m12: 0.25, m13: -0.25, m14: 0, m21: -0.25, m22: 0.95, m23: 0, m24: 0, m31: 0.2, m32: 0.05, m33: 0.95, m34: 0, m41: 0, m42: 0, m43: 0, m44: 1};
    const css1 = {a: 0.94, b: 0.25, c: -0.25, d: 0.95, e: 0, f: 0, m11: 0.93, m12: 0.25, m13: -0.25, m14: 0, m21: -0.25, m22: 0.95, m23: 0, m24: 0, m31: 0.2, m32: 0.05, m33: 0.95, m34: 0, m41: 0, m42: 0, m43: 0, m44: 1};
    const css2 = {m11: 0.93, m12: 0.25, m13: -0.25, m14: 0, m21: -0.25, m22: 0.95, m23: 0, m24: 0, m31: 0.2, m32: 0.05, m33: 0.95, m34: 0, m41: 0, m42: 0, m43: 0, m44: 1};
    const css3 = {a: 0.94, b: 0.25, c: -0.25, d: 0.95, e: 0, f: 0};

    [css1, css2, css3].forEach((c) => {
      try {
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

    cy.wrap(new CSSMatrix(css)).as('cc')
      .get('@cc').its('is2D').should('equal', css.is2D)
      .get('@cc').its('is2D').should('equal', new CSSMatrix(dom).is2D)
      .get('@cc').its('isIdentity').should('equal', css.isIdentity)
      .get('@cc').its('isIdentity').should('equal', new CSSMatrix(dom).isIdentity);

    cy.wrap(css.toJSON()).as('js')
      .get('@js').its('is2D').should('equal', css.is2D)
      .get('@js').its('is2D').should('equal', new CSSMatrix(dom).is2D)
      .get('@js').its('isIdentity').should('equal', css.isIdentity)
      .get('@js').its('isIdentity').should('equal', new CSSMatrix(dom).isIdentity)
  });

  it('Test specific private methods', () => {
    cy.log('CSSMatrix.rotateAxisAngle specific error');
    try {
      new CSSMatrix().rotateAxisAngle('a','true','wombat','05');
    } catch (err) {
      expect(err).to.be.instanceOf(TypeError);
      expect(err).to.have.property('message', 'CSSMatrix: expecting 4 values');
    }

    cy.log('CSSMatrix.rotate');
    const d1 = new DOMMatrix().rotate(15);
    cy.wrap(new CSSMatrix().rotate(15)).as('m1')
      .get('@cssmatrix').then(($el) => {
        const [el] = $el.get();
        cy.get('@m1').then((m1) => {
          el.style.transform = m1.toString();
        })
      })
      .get('@dommatrix').then(($el) => {
        const [el] = $el.get();
        el.style.transform = d1.toString();
      })
      .get('@m1').should((m1) => {
        expect(m1.isIdentity).to.equal(d1.isIdentity);
        expect(m1.is2D).to.equal(d1.is2D);
        expect(m1.toFloat32Array()).to.deep.equal(d1.toFloat32Array());
        expect(m1.toFloat64Array()).to.deep.equal(d1.toFloat64Array());
      });

    cy.log('CSSMatrix.rotate(x:25, y:15)');
    const d2 = new DOMMatrix().rotate(25,15);
    cy.wrap(new CSSMatrix().rotate(25,15)).as('m2')
      .get('@cssmatrix').then(($el) => {
        const [el] = $el.get();
        cy.get('@m2').then((m) => {
          el.style.transform = m.toString();
        });
      })
      .get('@dommatrix').then(($el) => {
        const [el] = $el.get();
        el.style.transform = d2.toString();
      })
      .get('@m2').should((m) => {
        expect(m.isIdentity).to.equal(d2.isIdentity);
        expect(m.is2D).to.equal(d2.is2D);
        expect(m.toFloat32Array()).to.deep.equal(d2.toFloat32Array());
        expect(m.toFloat64Array()).to.deep.equal(d2.toFloat64Array());
      });

    cy.log('CSSMatrix.translate(x:150)');
    const d3 = new DOMMatrix().translate(150);
    cy.wrap(new CSSMatrix().translate(150)).as('m3')
      .get('@cssmatrix').then(($el) => {
        const [el] = $el.get();
        cy.get('@m3').then((m) => {
          el.style.transform = m.toString();
        });
      })
      .get('@dommatrix').then(($el) => {
        const [el] = $el.get();
        el.style.transform = d3.toString();
      })
      .get('@m3').should((m) => {
        expect(m.isIdentity).to.equal(d3.isIdentity);
        expect(m.is2D).to.equal(d3.is2D);
        expect(m.toFloat32Array()).to.deep.equal(d3.toFloat32Array());
        expect(m.toFloat64Array()).to.deep.equal(d3.toFloat64Array());
      });

    cy.log('CSSMatrix.skew(x:15, y:-20)');
    const d4 = new DOMMatrix('skew(15deg, -20deg)');
    cy.wrap(new CSSMatrix().skew(15, -20)).as('m4')
      .log('In this test we\'re addapting to the output of the native DOMMatrix method since it doesn\'t support the skew() method itself.')
      .get('@cssmatrix').then(($el) => {
        const [el] = $el.get();
        cy.get('@m4').then((m) => {
          el.style.transform = m.toString();
        });
      })
      .get('@dommatrix').then(($el) => {
        const [el] = $el.get();
        el.style.transform = d4.toString();
      })
      .get('@m4').should((m) => {
        expect(m.isIdentity).to.equal(d4.isIdentity);
        expect(m.is2D).to.equal(d4.is2D);
        expect(m.toFloat32Array()).to.deep.equal(d4.toFloat32Array());
        expect(m.toFloat64Array()).to.deep.equal(d4.toFloat64Array());
      });

    cy.log('CSSMatrix.scale(x:1.3)');
    const d5 = new DOMMatrix().scale(1.3);
    cy.wrap(new CSSMatrix().scale(1.3)).as('m5')
      .get('@cssmatrix').then(($el) => {
        const [el] = $el.get();
        cy.get('@m5').then((m) => {
          el.style.transform = m.toString();
        });
      })
      .get('@dommatrix').then(($el) => {
        const [el] = $el.get();
        el.style.transform = d5.toString();
      })
      .get('@m5').should((m) => {
        expect(m.isIdentity).to.equal(d5.isIdentity);
        expect(m.is2D).to.equal(d5.is2D);
        expect(m.toFloat32Array()).to.deep.equal(d5.toFloat32Array());
        expect(m.toFloat64Array()).to.deep.equal(d5.toFloat64Array());
      });

    cy.log('CSSMatrix.scale(x:1.3,y:1.8)');
    const d6 = new DOMMatrix().scale(1.3,1.8);
    cy.wrap(new CSSMatrix().scale(1.3,1.8)).as('m6')
      .get('@cssmatrix').then(($el) => {
        const [el] = $el.get();
        cy.get('@m6').then((m) => {
          el.style.transform = m.toString();
        });
      })
      .get('@dommatrix').then(($el) => {
        const [el] = $el.get();
        el.style.transform = d6.toString();
      })
      .get('@m6').should((m) => {
        expect(m.isIdentity).to.equal(d6.isIdentity);
        expect(m.is2D).to.equal(d6.is2D);
        expect(m.toFloat32Array()).to.deep.equal(d6.toFloat32Array());
        expect(m.toFloat64Array()).to.deep.equal(d6.toFloat64Array());
      });

    cy.log('CSSMatrix.transformPoint');
    const p1 = new DOMPoint(15, 20, 35, 1);
    const p2 = { x: 15, y: 20, z: 35, w: 1};
    const dp = new DOMMatrix().rotate(15).translate(15, 15);

    cy.wrap(new CSSMatrix().rotate(15).translate(15, 15)).as('mp')
      .get('@mp').then((m) => {
        cy.log('For some reason the native DOMMatrix again falsely claims is2D to be true');
        expect(m.isIdentity).to.equal(dp.isIdentity);
        expect(m.is2D).to.equal(dp.is2D);
        expect(m.toFloat32Array()).to.deep.equal(dp.toFloat32Array());
        expect(m.toFloat64Array()).to.deep.equal(dp.toFloat64Array());
        expect(m.transformPoint(p1)).to.deep.equal(dp.transformPoint(p1));
        expect(m.transformPoint(p2)).to.deep.equal(dp.transformPoint(p2).toJSON());
      });    

  });

  it('Test init a 6 values array', () => {
    const test = [0.9659, 0.25879, -0.2588, 0.9659, -1.53961, -1.53961];
    const m1 = new CSSMatrix(test);
    const m2 = new CSSMatrix(...test);
    const m3 = new CSSMatrix([...test]);
    const m4 = new DOMMatrix(test);

    cy.wrap(m1).as('m1')
      .get('@m1').invoke('toFloat32Array').should(str => {
        expect(str).to.deep.equal(m2.toFloat32Array())
        expect(str).to.deep.equal(m3.toFloat32Array())
        expect(str).to.deep.equal(m4.toFloat32Array())
      })
  });

  it('Test init a 16 values array', () => { 
    const test = [0.852, 0.153, 0.186, -0.0004, -0.092, 0.869, -0.266, 0.0006, -0.25, 0.258, 0.933, -0.002, 0, 0, 0, 1];
    const m1 = new CSSMatrix(test);
    const m2 = new CSSMatrix(...test);
    const m3 = new CSSMatrix([...test]);
    const m4 = new DOMMatrix(test);

    cy.wrap(m1).as('m1')
      .get('@m1').invoke('toFloat32Array').should(str => {
        expect(str).to.deep.equal(m2.toFloat32Array())
        expect(str).to.deep.equal(m3.toFloat32Array())
        expect(str).to.deep.equal(m4.toFloat32Array())
      })
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

  Object.keys(testSamples).forEach((test) => {
    it(`Test string input ${test}, expect same output as native DOMMatrix`, () => {
      const str = testSamples[test];
      const css = new CSSMatrix(str);
      const dom = new DOMMatrix(str);
      
      cy.get('@cssmatrix').then(($el) => {
        const [el] = $el.get();
        el.style.transform = css.toString();
      });
      cy.get('@dommatrix').then(($el) => {
        const [el] = $el.get();
        el.style.transform = dom.toString();
      });
      cy.log('Due to the nature of the native DOMMatrix RegExp, for consistency reasons we\'re rounding numbers to 6 decimals in this test.')

              expect(Array.from(css.toFloat32Array()).map(x=> Math.floor(x * 10**6) / 10**6))
      .to.deep.equal(Array.from(dom.toFloat32Array()).map(x=> Math.floor(x * 10**6) / 10**6));

      cy.wrap(css).as('css')
        .log('The native `DOMMatrix` is a little weird when it comes to rotateAxisAngle, it falsely claims the identity matrix is NOT `is2D`')
        .get('@css').its('isIdentity').should((isIdentity) => expect(isIdentity).to.equal(dom.isIdentity))
        .get('@css').its('is2D').should((test === 'rotate3d1' ? 'not.equal' : 'equal'), dom.is2D);
    });
  })


});