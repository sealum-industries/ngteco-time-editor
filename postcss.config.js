module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-flexbugs-fixes': {},
    'postcss-preset-env': {
      features: {
        'nesting-rules': false,
      },
    },
    autoprefixer: {},
  },
};
