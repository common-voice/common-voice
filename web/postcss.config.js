module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-cssnext': {
      browsers: ['last 2 versions'],
      features: {
        customProperties: {
          warnings: false,
        },
        rem: { html: false },
      },
    },
    cssnano: { autoprefixer: false },
    'postcss-focus-within': {},
  },
};
