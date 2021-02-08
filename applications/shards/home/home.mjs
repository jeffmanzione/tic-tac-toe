import soynode from 'soynode';

import Shard from '../../../shard.mjs';
import { IncomingMessage, OutgoingMessage } from 'http';
import { State } from '../../../state.mjs';
import { createToken, renderPage } from '../../../util.mjs';
import { UserState } from '../../../state.mjs';

const USERNAME_QUERY_PARAM_KEY = 'username';
export const USER_COOKIE_KEY = 'tic-tac-toe-user';

export default class HomeShard extends Shard {
  /**
   * @param {!IncomingMessage} req 
   * @param {!OutgoingMessage} res 
   * @param {!State} state 
   * @param {!Mutator} mutator 
   * @override
   */
  receive(req, res, state) {
    if (req.method == 'POST' && state.req.url.pathname == '/logout') {
      this._logOut(res, state, mutator);
      return;
    }
    if (req.method === 'POST' && state.req.url.searchParams.get(USERNAME_QUERY_PARAM_KEY) != null) {
      this._logIn(res, state, mutator);
      return;
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');

    renderPage({
      res: res,
      soyTemplateName: 'tictactoe.home',
      soyTemplateInput: { username: state.user != null ? state.user.username : null },
      pathToScssFile: '/applications/shards/home/home.scss',
    });
    res.end();
  }
}