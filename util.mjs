import soynode from 'soynode';

/** Basic soy setup for this project. */
export function initSoy() {
  soynode.setOptions({
    outputDir: '/tmp/soynode/tictactoe',
    allowDynamicRecompile: true,
  });
  soynode.compileTemplates('./tic-tac-toe/', (err) => {
    if (err) throw err;
    console.log('Templates compiled!');
  });
};