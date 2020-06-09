const path = require('path');
const convict = require('convict');

const config = convict({
  env: {
    doc: 'The application environment',
    format: ['production', 'development'],
    default: 'development',
    env: 'NODE_ENV',
  },
  publish: {
      host: {
        doc: 'electron-builder publish host',
        format: String,
      },
      port: {
        doc: 'electron-builder publish port',
        format: 'port',
        default: 8080,
        env: 'PUBLISH_PORT',
      },
  },
});

const env = config.get('env');
config.loadFile(path.join(__dirname, `${env}.json`));

module.exports = config;
