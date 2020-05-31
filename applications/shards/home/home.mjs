import soynode from 'soynode';

import Shard from '../../../shard.mjs';
import { IncomingMessage, OutgoingMessage } from 'http';
import { State } from '../../../state.mjs';
import { renderPage } from '../../../util.mjs';

export default class HomeShard extends Shard {
  /**
   * @param {!IncomingMessage} req 
   * @param {!OutgoingMessage} res 
   * @param {!State} state 
   * @override
   */
  async receive(req, res, state) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    await renderPage({ res: res, soyTemplateName: 'tictactoe.home' }).then((_) => { res.end() });
  }
}