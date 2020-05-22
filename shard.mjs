import { IncomingMessage, OutgoingMessage } from 'http';
import { State } from './state.mjs';

export default class Shard {
  constructor() { }
  /**
   * @param {!IncomingMessage} req 
   * @param {!OutgoingMessage} res 
   * @param {!State} state 
   */
  receive(req, res, state) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Base shard: Unimplemented!\n');
  }
}