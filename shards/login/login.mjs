import soynode from 'soynode';

import Shard from '../../shard.mjs';
import { IncomingMessage, OutgoingMessage } from 'http';
import { State } from '../../state.mjs';

export default class LoginShard extends Shard {
  constructor() {
    super();
    soynode.compileTemplateFiles(['./tic-tac-toe/shards/login/login.soy'], (err) => {
      if (err) throw err; console.log('Login templates compiled!');
    });
  }
  /**
   * @param {!IncomingMessage} req 
   * @param {!OutgoingMessage} res 
   * @param {!State} state 
   * @override
   */
  receive(req, res, state) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(soynode.render('tictactoe.login'));
  }
}