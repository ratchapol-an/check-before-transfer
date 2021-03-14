/* eslint-disable */
const withLess = require('@zeit/next-less');

module.exports = withLess({
  target: 'serverless',
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  webpack: (config, { isServer }) => {
    config.externals.concat([{ pg: { commonjs2: 'pg' } }]);
    if (isServer) {
      const antStyles = /(antd\/.*?\/style).*(?<![.]js)$/;
      const origExternals = [...config.externals];
      config.externals = [
        (context, request, callback) => {
          if (request.match(antStyles)) return callback();
          if (typeof origExternals[0] === 'function') {
            origExternals[0](context, request, callback);
          } else {
            callback();
          }
        },
        ...(typeof origExternals[0] === 'function' ? [] : origExternals),
      ];
      config.module.rules.unshift({
        test: antStyles,
        use: 'null-loader',
      });
    }
    return config;
  },
});
