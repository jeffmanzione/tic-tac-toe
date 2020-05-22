import Application from './application.mjs';
import Server from './server.mjs';
import HomeShard from './shards/home/home.mjs';
import LoginShard from './shards/login/login.mjs';
import { initSoy } from './util.mjs';

initSoy();

new Server({
  hostname: 'hostname',
  applications: {
    8080: new Application(
      {
        '^/$': new HomeShard(),
        '^/login(/.*)?': new LoginShard(),
      }),
  }
}).start();