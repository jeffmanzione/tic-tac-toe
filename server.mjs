import Application from './application.mjs';
import { createServer } from 'http';
import { RequestState, ServerState, State } from './state.mjs';
import { Cookie } from './util.mjs';
import { Mutable, Mutator } from './mutate.mjs';

export default class Server {
  /**
   * @param {string=} hostname The hostname of the server.
   * @param {Object<number,Application>=} applications The port/application
   *   mapping for this server.
   */
  constructor({ applications = {} }) {
    /** @const @private */
    this._applications = applications;
    /** @const @private */
    this._state = new ServerState();

  }

  /** Starts the server. */
  start() {
    console.log(`Server starting.`);
    for (const [port, app] of Object.entries(this._applications)) {
      createServer((req, res) => {
        const reqState = new RequestState({
          path: req.url,
          cookie: new Cookie(req, res)
        });
        return app.receive(req, res, new State(this._state, reqState), new Mutator(this._createMutable()));
      }).listen(port,
        () => {
          app.describe(port);
        });
    }
  }

  /** 
   * @protected 
   * @returns {!Mutable}
  */
  _createMutable() {
    return new Mutable();
  }
}