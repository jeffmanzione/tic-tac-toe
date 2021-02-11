const evtSource = new EventSource('/game/sse');

const MATCH_SEARCH_ID = 'match-search';
const WAITING_FOR_OPPONENT_ID = 'waiting-for-opponent';
const USERNAME_ID = 'username';
const ASSIGNED_LETTER_ID = 'assigned-letter';
const BOARD_ID = 'board';

/** @returns {string} */
const getUserName = () => {
  return document.getElementById(USERNAME_ID).innerHTML;
};

const getLetter = () => {
  return document.getElementById(ASSIGNED_LETTER_ID).innerHTML;
};

/** @param {string} letter */
const setLetter = (letter) => {
  document.getElementById(ASSIGNED_LETTER_ID).innerHTML = letter.toUpperCase();
};

const getBoardEl = () => {
  return document.getElementById(BOARD_ID);
};

const getBoardData = () => {
  try {
    const board = getBoardEl();
    if (!board.dataset.board || board.dataset.board == 'undefined') {
      return;
    }
    return JSON.parse(board.dataset.board);
  } catch (e) {
    console.log(e);
    return null;
  }
};

const getOpponentName = () => {
  return getBoardEl().dataset.opponent;
};

const setOpponentName = (name) => {
  getBoardEl().dataset.opponent = name;
};

/** @returns {Array<string?>} */
const syncBoard = () => {
  try {
    const board = getBoardEl();
    if (!board.dataset.board || board.dataset.board == 'undefined') {
      return;
    }
    const boardData = JSON.parse(board.dataset.board);
    for (let i = 0; i < boardData.length; i++) {
      const row = Math.floor(i / 3);
      const col = i % 3;
      const cell = board.querySelectorAll('tr')[row].querySelectorAll('td')[col];
      cell.innerHTML = boardData[i] == null ? '' : boardData[i];
    }
  } catch (e) {
    // I tried.
    console.log(e);
  }
};

const setBoardData = (boardArr) => {
  getBoardEl().dataset.board = JSON.stringify(boardArr);
  syncBoard();
};

const isUserTurn = () => {
  const boardArr = getBoardData();
  if (!boardArr) {
    return true;
  }
  const countX = boardArr.filter(x => x == 'X').length;
  const countO = boardArr.filter(x => x == 'O').length;
  // X always goes first.
  return getLetter() == 'X' ? (countX == countO) : (countO < countX);
};

const isWinningMove = (boardArr, cellIndex, letter) => {
  const y = Math.floor(cellIndex / 3);
  const x = cellIndex % 3;

  let row = 0;
  let col = 0;
  let diag = 0;
  let rdiag = 0;

  for (let i = 0; i < 3; i++) {
    if (boardArr[3 * y + i] == letter) { row++; }
    if (boardArr[3 * i + x] == letter) { col++; }
    if (boardArr[3 * i + i] == letter) { diag++; }
    if (boardArr[2 + i * 2] == letter) { rdiag++; }
  }
  return row == 3 || col == 3 || diag == 3 || rdiag == 3;
}

const showWaitingForOpponent = (shouldShow = true) => {
  setTimeout(() => {
    const waitingInfoEl = document.getElementById(WAITING_FOR_OPPONENT_ID);
    waitingInfoEl.innerHTML = `Waiting for ${getOpponentName()}'s move`;
    waitingInfoEl.classList.remove(shouldShow ? 'not-waiting' : 'waiting');
    waitingInfoEl.classList.add(shouldShow ? 'waiting' : 'not-waiting');
  }, 0);
}

const handleCellClick = (el) => {
  const boardArr = JSON.parse(getBoardEl().dataset.board);
  // Cell must be emtpy.
  if (boardArr[el.dataset.cell] != null || !isUserTurn()) {
    return;
  }
  showWaitingForOpponent();
  boardArr[el.dataset.cell] = getLetter();
  const winner = isWinningMove(boardArr, el.dataset.cell, getLetter());
  const req = new XMLHttpRequest();
  req.open('POST', '/game/move');
  req.setRequestHeader('Accept', 'text/json');
  req.send(JSON.stringify({ board: boardArr, position: el.dataset.cell, isWinner: winner }));
  setBoardData(boardArr);
  if (winner) {
    // Wait for next loop so that the DOM can update with the finishing move.
    setTimeout(() => {
      confirm('You win!');
      location.reload();
    }, 0);
  }
};

getBoardEl().querySelectorAll('td').forEach((el) => {
  el.onclick = () => handleCellClick(el);
});

// If the user is invalid, redirect to the login page.
const userName = getUserName();
if (userName == null || userName == 'null') {
  window.location = '/login';
}

syncBoard();
if (!isUserTurn()) {
  showWaitingForOpponent();
}

evtSource.addEventListener(
  'event',
  function (evt) {
    const data = JSON.parse(evt.data);
    if (data.messageType == 'matchFound') {
      const waitingInfoEl = document.getElementById(MATCH_SEARCH_ID);
      waitingInfoEl.classList.remove('waiting');
      waitingInfoEl.classList.add('not-waiting');
      setLetter(data.letter);
      setBoardData(data.board);
      setOpponentName(data.opponent);
      if (!isUserTurn()) {
        showWaitingForOpponent();
      }
    } else if (data.messageType == 'partnerDisconnect') {
      confirm('Partner disconnected!');
      location.reload();
    } else if (data.messageType == 'updateBoard') {
      setBoardData(data.board);
      if (isUserTurn()) {
        showWaitingForOpponent(false);
      }
      const opponentWinner = isWinningMove(data.board, data.position, getLetter() == 'X' ? 'O' : 'X');
      if (opponentWinner) {
        // Wait for next loop so that the DOM can update with the finishing move.
        setTimeout(() => {
          confirm('You lose!');
          location.reload();
        }, 0);
      }
    } else {
      // Fallback to alert.
      alert(evt);
    }
  },
  false
);

function sendLogout() {
  const req = new XMLHttpRequest();
  req.open('POST', '/logout');
  req.send();
  req.onreadystatechange = function (e) {
    window.location = '/login';
  };
}
