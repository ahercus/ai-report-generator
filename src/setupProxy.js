const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api/generate-comment',
    createProxyMiddleware({
      target: 'https://api.openai.com/v1/engines/davinci-codex/completions',
      changeOrigin: true,
      pathRewrite: {
        '^/api/generate-comment': '',
      },
    })
  );
};
