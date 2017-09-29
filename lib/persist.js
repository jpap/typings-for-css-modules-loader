'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.writeToFileIfChanged = undefined;

var _gracefulFs = require('graceful-fs');

var _gracefulFs2 = _interopRequireDefault(_gracefulFs);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var writeToFileIfChanged = exports.writeToFileIfChanged = function writeToFileIfChanged(filename, content) {
  // Create the containing folder, as required
  var dirName = _path2.default.dirname(filename);
  if (!_gracefulFs2.default.existsSync(dirName)) {
    var sep = _path2.default.sep;
    var initDir = _path2.default.isAbsolute(dirName) ? sep : '';
    dirName.split(sep).reduce(function (parentDir, childDir) {
      var curDir = _path2.default.resolve(parentDir, childDir);
      if (!_gracefulFs2.default.existsSync(curDir)) {
        _gracefulFs2.default.mkdirSync(curDir);
      }
      return curDir;
    }, initDir);
  }

  if (_gracefulFs2.default.existsSync(filename)) {
    var currentInput = _gracefulFs2.default.readFileSync(filename, 'utf-8');

    if (currentInput !== content) {
      writeFile(filename, content);
    }
  } else {
    writeFile(filename, content);
  }
};

var writeFile = function writeFile(filename, content) {
  //Replace new lines with OS-specific new lines
  content = content.replace(/\n/g, _os2.default.EOL);

  _gracefulFs2.default.writeFileSync(filename, content, 'utf8');
};