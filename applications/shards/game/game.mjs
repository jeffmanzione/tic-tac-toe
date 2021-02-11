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

export class GamePageShard extends Shard {
  /**
   * @param {!IncomingMessage} req
   * @param {!OutgoingMessage} res
   * @param {!State} state
   * @param {!Mutator} mutator
   * @override
   */
  receive(req, res, state, mutator) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    renderPage({
      res: res,
      soyTemplateName: 'tictactoe.game',
      soyTemplateInput: this._createInput(state, mutator),
      pathToScssFile: '/applications/shards/game/game.scss',
    });
    res.end();
  }

  _createInput(state, mutator) {
    let input = {
      username: state.user != null ? state.user.username : null,
      isWaiting: state.game == null,
    };
    let assignedLetter;
    if (state.game == null) {
      assignedLetter = '';
    } else {
      assignedLetter = state.game.letterOf(state.user.token);
    }
    input['assignedLetter'] = assignedLetter;
    if (state.game != null) {
      input['boardData'] = JSON.stringify(state.game.board);
      input['opponentName'] = mutator.app.mutate('getOpponent', state.user).username;
    } else {
      input['boardData'] = '';
      input['opponentName'] = '';
    }
    return input;
  }
}

export class GameSSEShard extends Shard {
  /**
   * @param {!IncomingMessage} req
   * @param {!OutgoingMessage} res
   * @param {!State} state
   * @param {!Mutator} mutator
   * @override
   */
  receive(req, res, state, mutator) {
    if (state.user == null) {
      return;
    }
    const sse = new SSEManager();
    sse.subscribe(req, res);
    state.user.gameSse = sse;
    // Attempt to create a new game.
    if (state.game == null) {
      mutator.app.mutate('matchUser', state.user);
    }
  }
}

export class GameMoveShard extends Shard {
  /**
   * @param {!IncomingMessage} req
   * @param {!OutgoingMessage} res
   * @param {!State} state
   * @param {!Mutator} mutator
   * @override
   */
  receive(req, res, state, mutator) {
    let body = '';
    req.on('data', function (data) {
      body += data;
      if (body.length > 1e6)
        req.socket.destroy();
    });
    req.on('end', function () {
      const data = JSON.parse(body);
      mutator.app.mutate('pushGameState', { userState: state.user, board: data.board, position: data.position, isWinner: data.isWinner });
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.write('Thanks');
      res.end();
    });
  }
}


export class GameClientScriptsShard extends Shard {
  /**
 * @param {!IncomingMessage} req
 * @param {!OutgoingMessage} res
 * @param {!State} state
 * @param {!Mutator} mutator
 * @override
 */
  receive(req, res, state, mutator) {
    res.writeHead(200, { 'Content-Type': 'text/javascript' });
    res.write(
      fs.readFileSync(path.resolve() + '/applications/shards' + req.url)
    );
    res.end();
  }
}
