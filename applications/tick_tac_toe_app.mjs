import Application from '../application.mjs';
import HomeShard from './shards/home/home.mjs';
import { LoginShard, USER_COOKIE_KEY } from './shards/login/login.mjs';
import GameShard from './shards/game/game.mjs';
import { Mutable } from '../mutate.mjs';

export default class TicTacToeApp extends Application {
  constructor() {
    super(
      'tic-tac-toe', {
      '^/$': new HomeShard(),
      '^/log(in|out)(/.*)?': new LoginShard(),
      '^/game': new GameShard(),
    });
    this._userStates = {};
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
    this._userStates[userState.token] = null;
  }

  _listUnmatchedUsers() {
    let users = [];
    for (const userToken in this._userStates) {
      const user = this._userStates[userToken];
      if (!user.in_game) {
        users.push(user.username);
      }
    }
    return users;
  }

  /** @override */
  _createMutable() {
    return new Mutable({
      setUserState: (newUserState) => this._newUserState(newUserState),
      clearUserState: (userState) => this._clearUserState(userState),
      listUnmatchedUsers: () => this._listUnmatchedUsers(),
    });
  }
};