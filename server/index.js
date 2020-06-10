const express = require('express');
const { join } = require('path');
const fs = require('fs');
const { promisify } = require('util');

const releaseDir =join(__dirname, '..', 'release');

const config = require('../config');
const { port, path } = config.get('publish');

const app = express();
app.listen(port);

console.log('static server is listenint on port', port);

app.use(`/${path}`, express.static(releaseDir));

app.use('/', async (req, res) => {
    const files = (await promisify(fs.readdir)(releaseDir)).filter((elem) => elem.endsWith('.exe'));
    
    res.send(`
        <h2>Доступные версии</h2>
        <ul>
            ${files.map((file) => `<li><a href="/static/${file}">${file}</a></li>`).join('\n')}
        </ul>
    `);
});