import soynode from 'soynode';

import Shard from '../../../shard.mjs';
import { IncomingMessage, OutgoingMessage } from 'http';
import { State } from '../../../state.mjs';
import { renderPage } from '../../../util.mjs';

export default class GameShard extends Shard {
    /**
     * @param {!IncomingMessage} req 
     * @param {!OutgoingMessage} res 
     * @param {!State} state 
     * @override
     */
    receive(req, res, state) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        renderPage({ res: res, soyTemplateName: 'tictactoe.game' });
        res.end();
    }
}