import Application from '../application.mjs';
import HomeShard from './shards/home/home.mjs';
import { LoginShard, USER_COOKIE_KEY } from './shards/login/login.mjs';
import { Mutable } from '../mutate.mjs';

export default class TicTacToeApp extends Application {
  constructor() {
    super(
      'tic-tac-toe',
      {
        '^/$': new HomeShard(),
        '^/log(in|out)(/.*)?': new LoginShard(),
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

  /** @override */
  _createMutable() {
    return new Mutable({
      setUserState: (newUserState) => this._userStates[newUserState.token] = newUserState,
      clearUserState: (userState) => this._userStates[userState.token] = null
    });
  }
};