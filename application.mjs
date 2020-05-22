import Shard from './shard.mjs';
import { ApplicationState, State } from './state.mjs';
import { IncomingMessage, OutgoingMessage } from 'http';

export default class Application {
  /**
   * @param {Object<String,Shard>=} shards 
   */
  constructor(shards = {}) {
    /** @private @const */
    this._shards = shards;
    /** @private @const */
    this._state = new ApplicationState();
  }
  /**
   * @param {!IncomingMessage} req 
   * @param {!OutgoingMessage} res
   * @param {!State} state
   */
  receive(req, res, state) {
    state.app = this._state;
    for (const [path, shard] of Object.entries(this._shards)) {
      if (req.url.match(path)) {
        shard.receive(req, res, state);
        return;
      }
    }
    this._shardNotFound(res);
  }
  /** @param {!OutgoingMessage} res */
  _shardNotFound(res) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.end('No shard is present for the requested URL.\n');
  }
}