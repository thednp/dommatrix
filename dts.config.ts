const config = {
  entries: [
    {
      filePath: "./src/index.ts",
      outFile: `./dist/dommatrix.d.ts`,
      noCheck: false,
      output: {
        umdModuleName: 'CSSMatrix',
        noBanner: true,
      }
    },
  ],
};

module.exports = config;
