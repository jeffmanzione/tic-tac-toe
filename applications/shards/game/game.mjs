import fs from 'fs';
import path from 'path';
import soynode from 'soynode';

import Shard from '../../../shard.mjs';
import { IncomingMessage, OutgoingMessage } from 'http';
import { Mutator } from '../../../mutate.mjs';
import { State } from '../../../state.mjs';
import { createToken, renderPage } from '../../../util.mjs';
import { UserState } from '../../../state.mjs';
import { SSEManager } from '../../../sse.mjs';

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
  receive(req, res, state, mutator) {
    // SSE.
    if (req.url == '/game/sse' && state.user != null) {
      console.log('sse setup');
      const sse = new SSEManager();
      sse.subscribe(req, res);
      state.user.gameSse = sse;

      // The rest.
      const gameState = mutator.app.mutate('matchUser', state.user);
      console.log(gameState);
      return;
    }
    // For scripts.
    if (req.url.startsWith('/game/web')) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/javascript');
      res.write(
        fs.readFileSync(path.resolve() + '/applications/shards' + req.url)
      );
      res.end();
      return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    renderPage({
      res: res,
      soyTemplateName: 'tictactoe.game',
      soyTemplateInput: {
        username: state.user != null ? state.user.username : null,
        isWaiting: true,
      },
      pathToScssFile: '/applications/shards/game/game.scss',
    });
    res.end();
  }
}
