'use strict';

import buble from '@rollup/plugin-buble';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import * as pkg from './package.json';

const MIN = process.env.MIN === 'true' || false; // true/false|unset
const { FORMAT } = process.env; // JS umd|iife|esm
const INPUT = process.env.INPUTFILE;
const OUTPUTC = process.env.OUTPUTFILE;

const year = (new Date()).getFullYear();

const banner = `/*!
* DOMMatrix v${pkg.version} (${pkg.homepage})
* Copyright ${year} © ${pkg.author}
* Licensed under MIT (https://github.com/thednp/DOMMatrix/blob/master/LICENSE)
*/`;

const miniBannerJS = `// DOMMatrix v${pkg.version} | ${pkg.author} © ${year} | ${pkg.license}-License`;

const INPUTFILE = INPUT || 'src/index.js';
const OUTPUTFILE = OUTPUTC || `dist/dommatrix${FORMAT !== 'umd' ? `.${FORMAT}` : ''}${MIN ? '.min' : ''}.js`;

const OUTPUT = {
  file: OUTPUTFILE,
  format: FORMAT, // or iife
};

const PLUGINS = [
  json(),
  buble(),
];

if (MIN) {
  PLUGINS.push(terser({ output: { preamble: miniBannerJS } }));
} else {
  OUTPUT.banner = banner;
  // PLUGINS.push(cleanup());
}

if (FORMAT !== 'esm') {
  OUTPUT.name = 'CSSMatrix';
}

export default [
  {
    input: INPUTFILE,
    output: OUTPUT,
    plugins: PLUGINS,
  },
];
