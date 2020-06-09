const express = require('express');
const path = require('path');
const config = require('../config');

const port = config.get('publish').port;

const app = express();
app.listen(port);

console.log('static server is listenint on port', port);

app.use('/static', express.static(path.join(__dirname, '..', 'release')));