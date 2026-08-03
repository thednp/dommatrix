import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: { dommatrix: 'src/index.ts' },
  format: {
    es: {},
    cjs: { dts: false },
    umd: { dts: false },
  },
  globalName: 'CSSMatrix',
  sourcemap: true,
  dts: true,
  outExtensions: ({ format }) =>
    format === 'es' ? { dts: '.d.ts' } : undefined,
  outputOptions: (options, format) =>
    format === 'umd'
      ? { ...options, entryFileNames: '[name].js', chunkFileNames: '[name].js' }
      : undefined,
});
