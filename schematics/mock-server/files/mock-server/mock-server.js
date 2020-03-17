var mockServer = require('node-mock-server');
var path = require('path');

mockServer({
  restPath: path.join(__dirname, '/mock/rest'),
  dirName: __dirname,
  title: 'Api mock server',
  version: 2,
  urlBase: 'http://localhost',
  urlPath: '<%= mockPath %>',
  port: <%= port %>,
  uiPath: '/',
  headers: {
    'Access-Control-Allow-Headers': '*'
  }
});