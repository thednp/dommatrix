// sources
// * https://github.com/enketo/enketo-express/blob/master/tools/esbuild-plugin-istanbul.js

const { readFileSync } = require('fs');
const { createInstrumenter } = require('istanbul-lib-instrument');
const debug = require('debug')('istanbul-lib-instrument')

// import Cypress settings
const { env: { sourceFolder } } = require('../../cypress.json');
const cwd = process.cwd();
const sourcePath = sourceFolder.replace(/\//,'\\')
const sourceFilter = `${cwd}\\${sourcePath}`;

/**
 * @typedef {import('istanbul-lib-instrument').InstrumenterOptions} InstrumenterOptions
 */

/**
 * @typedef {import('source-map').RawSourceMap} RawSourceMap
 */

const instrumenter = createInstrumenter({
  compact: false,
  esModules: true,
});

/**
 * @return {import('esbuild').Plugin}
 */
const esbuildPluginIstanbul = () => ({
  name: 'istanbul',
  setup(build) {
    build.onLoad({filter: /[.js|.ts|.tsx|.jsx]$/ },
      async ({ path }) => {
        const contents = String(readFileSync(path, 'utf8'));

        if (!path.includes(sourceFilter)) {
          return { contents };
        }
        debug('instrumenting %s for output coverage', path);
        const instrumented = instrumenter.instrumentSync(contents, path);

        return { contents: instrumented };
      }
    );
  },
});

module.exports = esbuildPluginIstanbul;
