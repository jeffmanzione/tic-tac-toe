import { IncomingMessage, OutgoingMessage } from 'http';
import { State } from './state.mjs';

export default class Shard {
  constructor(webResources = null) {
    this._webResources = webResources;
  }
  /**
   * @param {!IncomingMessage} req 
   * @param {!OutgoingMessage} res 
   * @param {!State} state 
   */
  receive(req, res, state) {
    res.statusCode = 501;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Shard not implemented!\n');
  }
}