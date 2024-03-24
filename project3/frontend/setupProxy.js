// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
    })
  );
  app.use(
    '/another-api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
    })
  );

  // app.use(
  //   '/iframe',
  //   createProxyMiddleware({
  //     target: 'http://localhost:5000',
  //     changeOrigin: true,
  //   })
  // );
  // 추가
  console.log('Proxy setup successfully!');
};
