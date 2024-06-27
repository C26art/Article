const path = require('path');

module.exports = {
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'node_modules/')
    }
  }
};
