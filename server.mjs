import Application from './application.mjs';
import { ServerState, State } from './state.mjs';

import { createServer } from 'http';

export default class Server {
  /**
   * @param {string=} hostname The hostname of the server.
   * @param {Object<number,Application>=} applications The port/application mapping for this server.
   */
  constructor({ hostname = 'localhost', applications = {} }) {
    /** @const @private */
    this._hostname = hostname;
    /** @const @private */
    this._applications = applications;
    /** @const @private */
    this._state = new ServerState();

  }

  /** Starts the server. */
  start() {
    for (const [port, app] of Object.entries(this._applications)) {
      createServer((req, res) => {
        return app.receive(req, res, new State(this._state));
      }).listen(port, this._hostname);
    }
  }
}