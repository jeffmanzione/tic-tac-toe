export class State {
  /**
   * @param {!ServerState} serverState
   */
  constructor(serverState) {
    this.server = serverState;
    /** @private {?ApplicationState} */
    this.app = null;
    /** @private {?UserState} */
    this.user = null;
  }
}

export class ServerState {

}

export class ApplicationState {

}

export class UserState {

}
