module.exports = {
  plugins: {
    autoprefixer: {},
    "postcss-pxtorem": {
      rootValue: 10,
      replace: true,
      propList: ['*'],
      mediaQuery: false,
      minPixelValue: 0
    }
  }
}
