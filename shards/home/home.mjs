import soynode from 'soynode';

import Shard from '../../shard.mjs';
import { IncomingMessage, OutgoingMessage } from 'http';
import { State } from '../../state.mjs';

export default class HomeShard extends Shard {
  constructor() {
    super();
    soynode.compileTemplateFiles(['./tic-tac-toe/shards/home/home.soy'], (err) => {
      if (err) throw err; console.log('Home templates compiled!');
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
    res.end(soynode.render('tictactoe.home'));
  }
}