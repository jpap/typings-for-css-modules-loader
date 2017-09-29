'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateGenericExportInterface = exports.generateNamedExports = exports.filenameToTypingsFilename = exports.filterNonWordClasses = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var filenameToInterfaceName = function filenameToInterfaceName(filename) {
  return _path2.default.basename(filename).replace(/^(\w)/, function (_, c) {
    return 'I' + c.toUpperCase();
  }).replace(/\W+(\w)/g, function (_, c) {
    return c.toUpperCase();
  });
};

var cssModuleToTypescriptInterfaceProperties = function cssModuleToTypescriptInterfaceProperties(cssModuleKeys) {
  var indent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '  ';

  return cssModuleKeys.map(function (key) {
    return indent + '\'' + key + '\': string;';
  }).join('\n');
};

var cssModuleToNamedExports = function cssModuleToNamedExports(cssModuleKeys) {
  return cssModuleKeys.map(function (key) {
    return 'export const ' + key + ': string;';
  }).join('\n');
};

var allWordsRegexp = /^\w+$/i;
var filterNonWordClasses = exports.filterNonWordClasses = function filterNonWordClasses(cssModuleKeys) {
  var filteredClassNames = cssModuleKeys.filter(function (classname) {
    return allWordsRegexp.test(classname);
  });
  if (filteredClassNames.length === cssModuleKeys.length) {
    return [filteredClassNames, []];
  }
  var nonWordClassNames = cssModuleKeys.filter(function (classname) {
    return !allWordsRegexp.test(classname);
  });
  return [filteredClassNames, nonWordClassNames];
};

var filenameToTypingsFilename = exports.filenameToTypingsFilename = function filenameToTypingsFilename(filename, pathPrefix, contextPath) {
  // Default implementation: co-locate .d.ts with the resource
  var pathPrefixCallbackDefault = function pathPrefixCallbackDefault(filename) {
    var dirName = _path2.default.dirname(filename);
    var baseName = _path2.default.basename(filename);
    return _path2.default.join(dirName, baseName + '.d.ts');
  };

  var pathPrefixCallback = pathPrefixCallbackDefault;

  if (pathPrefix) {
    switch (typeof pathPrefix === 'undefined' ? 'undefined' : _typeof(pathPrefix)) {
      case 'string':
        {
          if (pathPrefix.endsWith(_path2.default.sep)) {
            pathPrefix = pathPrefix.slice(0, -1);
          }
          var dirName = _path2.default.dirname(filename);
          var baseName = _path2.default.basename(filename);
          // There are three cases here:
          //  1. filename is within the webpack context: add the prefix
          if (dirName.startsWith(contextPath)) {
            dirName = dirName.slice(contextPath.length);
            pathPrefixCallback = function pathPrefixCallback() {
              return _path2.default.join(contextPath, pathPrefix, dirName, baseName + '.d.ts');
            };
          }
          //  2. pathPrefix is absolute
          //  3. filename is outside the webpack context
          else {
              // Use the default implementation for co-locating the .d.ts
            }
          break;
        }

      case 'function':
        // Use the user-configured filename mapping function
        pathPrefixCallback = pathPrefix;
        break;

      default:
        // Bad configuration
        return undefined;
    }
  }

  return pathPrefixCallback(filename, contextPath);
};

var generateNamedExports = exports.generateNamedExports = function generateNamedExports(cssModuleKeys) {
  var namedExports = cssModuleToNamedExports(cssModuleKeys);
  return namedExports + '\n';
};

var generateGenericExportInterface = exports.generateGenericExportInterface = function generateGenericExportInterface(cssModuleKeys, filename, indent) {
  var interfaceName = filenameToInterfaceName(filename);
  var interfaceProperties = cssModuleToTypescriptInterfaceProperties(cssModuleKeys, indent);
  return 'export interface ' + interfaceName + ' {\n' + interfaceProperties + '\n}\n\nexport const locals: ' + interfaceName + ';\n';
};