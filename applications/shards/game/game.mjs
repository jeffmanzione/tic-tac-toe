import soynode from 'soynode';

import Shard from '../../../shard.mjs';
import { IncomingMessage, OutgoingMessage } from 'http';
import { Mutator } from '../../../mutate.mjs';
import { State } from '../../../state.mjs';
import { createToken, renderPage } from '../../../util.mjs';
import { UserState } from '../../../state.mjs';

const USERNAME_QUERY_PARAM_KEY = 'username';
export const USER_COOKIE_KEY = 'tic-tac-toe-user';

export default class GameShard extends Shard {
  /**
   * @param {!IncomingMessage} req 
   * @param {!OutgoingMessage} res 
   * @param {!State} state 
   * @param {!Mutator} mutator 
   * @override
   */
  receive(req, res, state) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    renderPage({
      res: res,
      soyTemplateName: 'tictactoe.game',
      soyTemplateInput: { 'username': state.user != null ? state.user.username : null },
      pathToScssFile: '/applications/shards/game/game.scss',
    });
    res.end();
  }
}