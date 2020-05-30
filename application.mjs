import Shard from './shard.mjs';
import { Mutator, Mutable } from './mutate.mjs';
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
   * @param {!Mutator} mutator
   */
  receive(req, res, state, mutator) {
    state.app = this._state;
    for (const [path, shard] of Object.entries(this._shards)) {
      if (req.url.match(path)) {
        mutator.app = this._createMutable();
        shard.receive(req, res, state, mutator);
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

  /** 
   * @protected 
   * @returns {!Mutable}
  */
  _createMutable() {
    return new Mutable();
  }
}