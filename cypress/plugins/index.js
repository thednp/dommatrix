/// <reference types="cypress" />
// ***********************************************************

const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');

/**
 * @type {Cypress.PluginConfig}
*/
module.exports = (on, config) => {
  require('@cypress/code-coverage/task')(on, config);

  // https://esbuild.github.io/api/
  const esBuildOptions = {
    define: {
      // replaces every instance of "process.env.NODE_ENV" string
      // in the spec with the string "development"
      'process.env.NODE_ENV': '"development"'
    },
  }
  
  // pass ESBuild options to be applied to each spec file
  on('file:preprocessor', createBundler(esBuildOptions));
  
  // IMPORTANT to return the config object
  // with the any changed environment variables
  return config;
}
