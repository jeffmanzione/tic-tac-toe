import TicTacToeApp from './applications/tick_tac_toe_app.mjs';
import Server from './server.mjs';
import { initSoy } from './util.mjs';


const hostname = process.env.HOSTNAME | 'localhost';

initSoy().then(() => {
  new Server({
    hostname: hostname,
    applications: {
      8080: new TicTacToeApp(),
    }
  }).start();

}).catch((error) => {
  console.log('Failed to compile soy templates.')
});