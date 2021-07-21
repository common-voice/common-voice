module.exports = {
  plugins: [
    'postcss-import',
    [
      'postcss-color-mod-function',
      {
        importFrom: './src/components/vars.css',
      },
    ],
    'postcss-nested',
    'postcss-custom-media',
    'postcss-preset-env',
    ['cssnano', {

      "preset": [
        "default",
        {
          "calc": false
        }
      ]

    }],
  ],
};
