const path = require("path");

module.exports = {
  resolve: {
    fallback: {
      path: require.resolve("path-browserify"),
      net: require.resolve("net-browserify"),
      http: require.resolve("stream-http"),
      util: require.resolve("util/"),
      zlib: require.resolve("browserify-zlib"),
      querystring: require.resolve("querystring-es3"),
      fs: false,
      stream: require.resolve("stream-browserify"),
      url: require.resolve("url/"),
    },
  },
};
