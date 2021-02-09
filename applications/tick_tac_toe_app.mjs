import Application from '../application.mjs';
import HomeShard from './shards/home/home.mjs';
import { LoginShard, USER_COOKIE_KEY } from './shards/login/login.mjs';
import GameShard from './shards/game/game.mjs';
import { Mutable } from '../mutate.mjs';
import { GameState } from '../state.mjs';

export default class TicTacToeApp extends Application {
  constructor() {
    super('tic-tac-toe', {
      '^/$': new HomeShard(),
      '^/log(in|out)(/.*)?': new LoginShard(),
      '^/game': new GameShard(),
    });
    this._userStates = {};

    this._gameStates = {};
  }
  /**
   * @param {!IncomingMessage} req
   * @param {!OutgoingMessage} res
   * @param {!State} state
   * @param {!Mutator} mutator
   *
   * @override
   */
  receive(req, res, state, mutator) {
    state.user = this._getUserState(state.req.cookie);
    state.game = state.user != null ? this._gameStates[state.user.token] : null;
    super.receive(req, res, state, mutator);
  }

  _getUserState(cookie) {
    const userToken = cookie.getValue(USER_COOKIE_KEY);
    if (userToken == null) {
      return null;
    }
    return this._userStates[userToken];
  }

  _newUserState(newUserState) {
    if (newUserState == null || this._userStates == null) {
      return;
    }
    this._userStates[newUserState.token] = newUserState;
  }

  _clearUserState(userState) {
    if (userState == null || this._userStates == null) {
      return;
    }

    delete this._userStates[userState.token];
  }

  _listUnmatchedUsers() {
    let users = [];
    for (const userToken in this._userStates) {
      const user = this._userStates[userToken];
      if (!user.inGame) {
        users.push(user.username);
      }
    }
    return users;
  }

  _endGameForUser(userState) {
    delete this._gameStates[userState.token];
    userState.inGame = false;
  }

  _maybeDisconnectGame(userState) {
    if (userState == null) {
      return;
    }
    const gameState = this._gameStates[userState.token];
    console.log(gameState);

    const user1 = this._userStates[gameState.user1Token];
    const user2 = this._userStates[gameState.user2Token];
    // End the game for the players.
    this._endGameForUser(user1);
    this._endGameForUser(user2);
    // Tell partner this user disconnected.
    const partner = userState.token == user1.token ? user2 : user1;
    partner.gameSse.publish({ messageType: 'partnerDisconnect' });
  }

  _addUserToGame(userState, gameState) {
    this._gameStates[userState.token] = gameState;
    userState.inGame = true;
    userState.gameSse.publish({ messageType: 'matchFound' });
  }

  _matchUser(userState) {
    if (userState == null) {
      return null;
    }
    for (const userToken in this._userStates) {
      const user = this._userStates[userToken];
      if (user.inGame || userToken == userState.token) {
        continue;
      }
      const gameState = new GameState(userState.token, user.token);
      this._addUserToGame(userState, gameState);
      this._addUserToGame(user, gameState);
      return gameState;
    }
    return null;
  }

  /** @override */
  _createMutable() {
    return new Mutable({
      setUserState: (newUserState) => this._newUserState(newUserState),
      clearUserState: (userState) => this._clearUserState(userState),
      listUnmatchedUsers: () => this._listUnmatchedUsers(),
      matchUser: (userState) => this._matchUser(userState),
      disconnectUser: (userState) => this._maybeDisconnectGame(userState),
    });
  }
}
