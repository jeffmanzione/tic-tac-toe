import soynode from 'soynode';

import Shard from '../../../shard.mjs';
import { IncomingMessage, OutgoingMessage } from 'http';
import { Mutator } from '../../../mutate.mjs';
import { State } from '../../../state.mjs';
import { createToken, renderPage } from '../../../util.mjs';
import { UserState } from '../../../state.mjs';

const USERNAME_QUERY_PARAM_KEY = 'username';
export const USER_COOKIE_KEY = 'tic-tac-toe-user';

export class LoginShard extends Shard {
  /**
   * @param {!IncomingMessage} req 
   * @param {!OutgoingMessage} res 
   * @param {!State} state 
   * @param {!Mutator} mutator 
   * @override
   */
  receive(req, res, state, mutator) {
    if (req.method == 'POST' && state.req.path == '/logout') {
      this._logOut(res, state, mutator);
      return;
    }
    if (req.method === 'POST' && new URL(state.req.path, 'http://foo.com').searchParams.get(USERNAME_QUERY_PARAM_KEY) != null) {
      this._logIn(res, state, mutator);
      return;
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');

    renderPage({
      res: res,
      soyTemplateName: 'tictactoe.login',
      soyTemplateInput: { username: state.user != null ? state.user.username : null },
      pathToScssFile: '/applications/shards/login/login.scss',
    });
    res.end();
  }

  _logIn(res, state, mutator) {
    const usernameParam = new URL(state.req.path, 'http://foo.com').searchParams.get(USERNAME_QUERY_PARAM_KEY);
    // User already has a login token.
    if (state.user != null) {
      // This person is tring to steal someone else's identity!
      if (state.user.username != usernameParam) {
        // TODO(jmanzion): What should we do here.
        console.log('Wowowow you are a sly dog.');
      }
      return;
    }
    // Give user token.
    const token = createToken();
    state.req.cookie.setValue(USER_COOKIE_KEY, token);
    // Pass new user state to app.
    mutator.app.mutate('setUserState', new UserState(usernameParam, token));
    res.statusCode = 200;
    res.end();
  }

  _logOut(res, state, mutator) {
    // Disconnects self and partner if in the middle of a game.
    mutator.app.mutate('disconnectUser', state.user);
    // Removes creds in the browser.
    state.req.cookie.clearValue(USER_COOKIE_KEY);
    // Pass new user state to app.
    mutator.app.mutate('clearUserState', state.user);
    res.statusCode = 200;
    res.end();
  }
}