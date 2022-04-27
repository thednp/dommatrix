// sources
// * https://github.com/enketo/enketo-express/blob/master/tools/esbuild-plugin-istanbul.js

const { readFileSync } = require('fs');
const { createInstrumenter } = require('istanbul-lib-instrument');
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
    build.onLoad({filter: /./ },
      async ({ path }) => {
        const contents = String(readFileSync(path, 'utf8'));
        
        if (!path.includes('/dommatrix/src/')) {
          return { contents };
        }
        const instrumented = instrumenter.instrumentSync(contents, path);

        return { contents: instrumented };
      }
    );
  },
});

module.exports = esbuildPluginIstanbul;
