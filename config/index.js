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
      port: {
        doc: 'electron-builder publish port',
        format: 'port',
        default: 8080,
        env: 'PUBLISH_PORT',
      },
      path: {
        doc: 'electron-builder publish path',
        format: String,
        default: '/',
        env: 'PUBLISH_PATH',
      },
  },
});

// TODO: uncomment this lines and add files with custom configuration for each env value
// const env = config.get('env');
// config.loadFile(path.join(__dirname, `${env}.json`));

module.exports = config;
