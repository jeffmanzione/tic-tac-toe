import TicTacToeApp from './applications/tick_tac_toe_app.mjs';
import Server from './server.mjs';
import { initSoy } from './util.mjs';

const port = process.env.PORT || 80;

initSoy().then(() => {
  let applications = {};
  applications[port] = new TicTacToeApp();

  new Server({
    applications: applications,
  }).start();

}).catch((error) => {
  console.log('Failed to compile soy templates.', e)
});