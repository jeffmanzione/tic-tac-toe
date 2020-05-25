import Application from './application.mjs';
import { createServer } from 'http';
import { ServerState, State } from './state.mjs';

export default class Server {
  /**
   * @param {string=} hostname The hostname of the server.
   * @param {Object<number,Application>=} applications The port/application
   *   mapping for this server.
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
    console.log(`Server starting for ${this._hostname}.`);
    for (const [port, app] of Object.entries(this._applications)) {
      createServer((req, res) => {
        return app.receive(req, res, new State(this._state));
      }).listen(port, this._hostname,
        () => {
          app.describe(this._hostname, port);
        });
    }
  }
}