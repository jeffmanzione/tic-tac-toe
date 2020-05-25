import Shard from './shard.mjs';
import { ApplicationState, State } from './state.mjs';
import { IncomingMessage, OutgoingMessage } from 'http';

export default class Application {
  /**
   * @param {string} shards 
   * @param {Object<string,Shard>=} shards 
   */
  constructor(name, shards = {}) {
    /** @const */
    this.name = name;
    /** @private @const */
    this._shards = shards;
    /** @private @const */
    this._state = new ApplicationState();
  }
  /**
   * @param {string} hostname 
   * @param {number} port 
   */
  describe(hostname, port) {
    console.log(`Application \'${this.name}\' at ${hostname}:${port}:`);
    for (const [path, shard] of Object.entries(this._shards)) {
      console.log(`  ${path}`);
    }
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