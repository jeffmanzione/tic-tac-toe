const evtSource = new EventSource('/game/sse');

const WAITING_INFO_CLASS = 'waiting-info';

evtSource.addEventListener(
  'event',
  function (evt) {
    const data = JSON.parse(evt.data);
    if (data.messageType == 'matchFound') {
      const waitingInfoEl = document.getElementsByClassName(
        WAITING_INFO_CLASS
      )[0];
      waitingInfoEl.classList.remove('waiting');
      waitingInfoEl.classList.add('not-waiting');
    } else if (data.messageType == 'partnerDisconnect') {
      confirm('Partner disconnected!');
      location.reload();
    } else {
      // Fallback to alert.
      alert(evt);
    }
  },
  false
);

let playerOne = '';

function sendLogout() {
  const req = new XMLHttpRequest();
  req.open('POST', '/logout');
  req.send();
  req.onreadystatechange = function (e) {
    window.location = '/login';
  };
}

function setX() {
  playerOne = 'x';
}

function setO() {
  playerOne = 'o';
}

function newGame() {
  const old_table = document.getElementById('gameboard');
  const board_size = 3;
  if (old_table) {
    old_table.parentNode.removeChild(old_table);
  }
  const board = document.getElementById('tableplace');
  const table = document.createElement('table');
  table.setAttribute('id', 'gameboard');
  const tbody = document.createElement('tbody');
  for (var i = 0; i < board_size; i++) {
    const tr = document.createElement('tr');
    for (var j = 0; j < board_size; j++) {
      tr.appendChild(document.createElement('td'));
    }
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  board.appendChild(table);
  const cells = document.getElementsByTagName('td');
  for (var i = 0; i < cells.length; i++) {
    cells[i].addEventListener('click', drawXO);
  }
}

function checkForWinner() {
  let row1cell1 = document.getElementById('gameboard').rows[0].cells[0]
    .innerHTML;
  let row1cell2 = document.getElementById('gameboard').rows[0].cells[1]
    .innerHTML;
  let row1cell3 = document.getElementById('gameboard').rows[0].cells[2]
    .innerHTML;
  let row2cell1 = document.getElementById('gameboard').rows[1].cells[0]
    .innerHTML;
  let row2cell2 = document.getElementById('gameboard').rows[1].cells[1]
    .innerHTML;
  let row2cell3 = document.getElementById('gameboard').rows[1].cells[2]
    .innerHTML;
  let row3cell1 = document.getElementById('gameboard').rows[2].cells[0]
    .innerHTML;
  let row3cell2 = document.getElementById('gameboard').rows[2].cells[1]
    .innerHTML;
  let row3cell3 = document.getElementById('gameboard').rows[2].cells[2]
    .innerHTML;
  if (row1cell1 == row1cell2 && row1cell1 == row1cell3 && row1cell1 != '') {
    winner = row1cell1;
    alert(winner + ' is the winner!');
  } else if (
    row2cell1 == row2cell2 &&
    row2cell2 == row2cell3 &&
    row2cell1 != ''
  ) {
    winner = row2cell1;
    alert(winner + ' is the winner!');
  } else if (
    row3cell1 == row3cell2 &&
    row3cell1 == row3cell3 &&
    row3cell1 != ''
  ) {
    winner = row3cell1;
    alert(winner + ' is the winner!');
  } else if (
    row1cell1 == row2cell1 &&
    row1cell1 == row3cell1 &&
    row1cell1 != ''
  ) {
    winner = row1cell1;
    alert(winner + ' is the winner!');
  } else if (
    row1cell2 == row2cell2 &&
    row1cell2 == row3cell2 &&
    row1cell2 != ''
  ) {
    winner = row1cell2;
    alert(winner + ' is the winner!');
  } else if (
    row1cell3 == row2cell3 &&
    row1cell3 == row3cell3 &&
    row1cell3 != ''
  ) {
    winner = row1cell3;
    alert(winner + ' is the winner!');
  } else if (
    row1cell1 == row2cell2 &&
    row1cell1 == row3cell3 &&
    row1cell1 != ''
  ) {
    winner = row1cell1;
    alert(winner + ' is the winner!');
  } else if (
    row1cell3 == row2cell2 &&
    row1cell3 == row3cell1 &&
    row1cell3 != ''
  ) {
    winner = row1cell3;
    alert(winner + ' is the winner!');
  }
}

function drawXO() {
  if (playerOne == 'x') {
    this.innerHTML = 'X';
  } else if (playerOne == 'o') {
    this.innerHTML = 'O';
  }
  checkForWinner();
}
