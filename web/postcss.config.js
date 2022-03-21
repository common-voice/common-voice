module.exports = {
  plugins: [
    'postcss-preset-env',
    'postcss-import',
    ['postcss-color-mod-function', { importFrom: './src/components/vars.css' }],
    'postcss-nested',
    'postcss-custom-media',
    ['cssnano', { preset: ['default', { calc: false }] }],
  ],
};
