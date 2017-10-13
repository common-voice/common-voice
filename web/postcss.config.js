module.exports = {
    plugins: {
      'postcss-cssnext': {
        browsers: ['last 2 versions' ],
        features: {
          customProperties: {
            warnings: false
          }
        },
      },
      'cssnano': { autoprefixer: false }
    }
};