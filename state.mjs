import { Cookie } from './util.mjs';

export class State {
  /**
   * @param {!ServerState} serverState
   * @param {RequestState=} reqState
   */
  constructor(serverState, reqState = null) {
    /** @const {!ServerState} */
    this.server = serverState;
    /** @type {?RequestState} */
    this.req = reqState;
    /** @type {?ApplicationState} */
    this.app = null;
    /** @type {?UserState} */
    this.user = null;
    /** @type {?GameState} */
    this.game = null;
  }
}

export class ServerState { }

export class RequestState {
  constructor({ cookie = null }) {
    /** @type {?Cookie} */
    this.cookie = cookie;
  }
}

export class ApplicationState { }



export class UserState {
  constructor(username, token) {
    /** @const {string} */
    this.username = username;
    /** @const {string} */
    this.token = token;
    /** @type {bool} */
    this.inGame = false;
    /** @type {?SSEManager} */
    this.gameSse = null;
  }
}

export class GameState {
  constructor(user1Token, user2Token) {
    /** @const {string} */
    this.user1Token = user1Token;
    /** @const {string} */
    this.user2Token = user2Token;
    /** @const {string} */
    this.user1Letter = 'X';
    /** @const {string} */
    this.user2Letter = 'O';
    /** @type {Array<string?>} */
    this.board = [
      null, null, null,
      null, null, null,
      null, null, null,
    ];
  }
  /**
   * @param {string} userToken
   * @returns {string}
   */
  letterOf(userToken) {
    if (userToken == this.user1Token) {
      return this.user1Letter;
    } else if (userToken == this.user2Token) {
      return this.user2Letter;
    }
    return null;
  }
}
