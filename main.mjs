import TicTacToeApp from './applications/tick_tac_toe_app.mjs';
import Server from './server.mjs';
import { initSoy } from './util.mjs';

initSoy().then(() => {
  new Server({
    applications: {
      80: new TicTacToeApp(),
    }
  }).start();

}).catch((error) => {
  console.log('Failed to compile soy templates.', e)
});