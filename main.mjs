import TicTacToeApp from './applications/tick_tac_toe_app.mjs';
import Server from './server.mjs';
import { initSoy } from './util.mjs';

initSoy();

new Server({
  hostname: 'localhost',
  applications: {
    8080: new TicTacToeApp(),
  }
}).start();