'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
const fonts = (typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.src || new URL('assets/fonts/index.cjs', document.baseURI).href)).replace(/^file:\/\/|\/\w+\.?[jt]s$/g, "").replace(/\/index\.[a-z]+$/g, "");

exports.fonts = fonts;
