import path from 'path';
import sass from 'sass';
import soynode from 'soynode';
import { OutgoingMessage } from 'http';

/** Basic soy setup for this. */
export function initSoy() {
  soynode.setOptions({
    outputDir: '/tmp/soynode/tictactoe',
    allowDynamicRecompile: true,
  });
  soynode.compileTemplates('./', (err) => {
    if (err) throw err;
    console.log('Templates compiled!');
  });
};

/**
 * Generates a new psuedo-random token to be used as a unique session identifier.
 *  
 * @returns {string} A pseudo-random string.
 */
export function createToken() {
  return Math.random().toString(36).substr(2);
}

/** Abstracted interface for extracting cookie values. */
export class Cookie {
  /**
   * @param {!IncomingMessage} req
   * @param {!OutgoingMessage} res
   */
  constructor(req, res) {
    /** @private @const */
    this._res = res;
    /** @private @const */
    this._cookie = req.headers.cookie != null ? req.headers.cookie : '';
    /** @private */
    this._cookieMap = null;
  }
  /**
   * Gets the value for the specified cookie key.
   * 
   * @param {string} key 
   * @returns {?string}
   */
  getValue(key) {
    if (this._cookieMap == null) {
      this._parseCookie();
    }
    const val = this._cookieMap[key];
    return val == '' ? null : val;
  }
  /* Parses the cookie string into an object. */
  _parseCookie() {
    this._cookieMap = {};
    this._cookie.split(';').forEach((cookie) => {
      var parts = cookie.split('=');
      this._cookieMap[parts.shift().trim()] = decodeURI(parts.join('='));
    });
  }
  /**
   * Sets the value for the cookie key.
   * 
   * @param {string} key 
   * @param {string} value 
   */
  setValue(key, value) {
    this._res.writeHead(200, {
      'Set-Cookie': `${key}=${value}`,
      'Content-Type': 'text/plain'
    });
  }
  /**
   * Sets the value for the cookie key.
   * 
   * @param {string} key
   */
  clearValue(key) {
    this._res.writeHead(200, {
      'Set-Cookie': `${key}=null; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
      'Content-Type': 'text/plain'
    });
  }
}

/**
 * @param {string} pathToScssFile
 * @returns {!Promise<string>} Promise that resolves the script element for the styles. 
 */
export function renderSassStyles(pathToScssFile) {
  return new Promise(function (resolve, _) {
    const compiledSass = sass.renderSync({ file: path.resolve() + pathToScssFile });
    resolve(`<style>${compiledSass.css}</style>`);
  });
}

/**
 * @param {string} templateName
 * @param {Object<string, !Object>=} input 
 * @returns {!Promise<string>} Promise that resolves to the page HTML.
 */
export function renderSoyTemplate(templateName, input) {
  return new Promise(function (resolve, _) {
    resolve(soynode.render(templateName, input = {}));
  });
}

/**
 * @param {!OutgoingMessage} res
 * @param {string} soyTemplateName
 * @param {Object<string, !Object>=} soyTemplateInput 
 * @param {string=} pathToScssFile
 * @returns {!Promise<string>} Promise that resolves to the page HTML.
 */
export async function renderPage({ res, soyTemplateName, pathToScssFile = null, soyTemplateInput = {} }) {
  return Promise.all([
    pathToScssFile == null ? Promise.resolve(null) : renderSassStyles(pathToScssFile),
    renderSoyTemplate(soyTemplateName, soyTemplateInput)
  ]).then(([css, html]) => {
    if (css != null) {
      res.write(css);
    }
    res.write(html);
  });
}