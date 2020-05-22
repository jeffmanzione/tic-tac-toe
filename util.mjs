import soynode from 'soynode';

export function initSoy() {
  soynode.setOptions({
    outputDir: '/tmp/soynode/tictactoe'
    , allowDynamicRecompile: true
  });
};