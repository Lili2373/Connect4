const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = createBoard();

function createBoard() {
  // Create an empty game board
  const board = [];
  for (let y = 0; y < HEIGHT; y++) {
    board.push(Array(WIDTH).fill(null));
  }
  return board;
}

function createHtmlBoard() {
  const boardElement = document.getElementById('board');
  const columnTop = createColumnTop();
  boardElement.append(columnTop);

  for (let y = 0; y < HEIGHT; y++) {
    const row = createRow(y);
    boardElement.append(row);
  }
}

function createColumnTop() {
  const columnTop = document.createElement('tr');
  columnTop.setAttribute('id', 'column-top');
  columnTop.addEventListener('click', handleColumnClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement('td');
    headCell.setAttribute('id', x);
    columnTop.append(headCell);
  }

  return columnTop;
}

function createRow(y) {
  const row = document.createElement('tr');
  for (let x = 0; x < WIDTH; x++) {
    const cell = createCell(y, x);
    row.append(cell);
  }
  return row;
}

function createCell(y, x) {
  const cell = document.createElement('td');
  cell.setAttribute('id', `${y}-${x}`);
  return cell;
}

function handleColumnClick(evt) {
  const x = +evt.target.id;
  const y = findSpotForCol(x);
  if (y !== null) {
    dropPiece(y, x);
    if (checkForWin()) {
      endGame(`Player ${currPlayer} won!`);
    } else if (boardIsFull()) {
      endGame('Tie!');
    } else {
      togglePlayer();
    }
  }
}

function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }
  return null;
}

function dropPiece(y, x) {
  board[y][x] = currPlayer;
  placePieceInTable(y, x);
}

function placePieceInTable(y, x) {
  const piece = document.createElement('div');
  piece.classList.add('piece');
  piece.classList.add(`p${currPlayer}`);
  piece.style.top = -50 * (y + 2) + 'px';
  const spot = document.getElementById(`${y}-${x}`);
  spot.append(piece);
}

function endGame(message) {
  alert(message);
}

function togglePlayer() {
  currPlayer = currPlayer === 1 ? 2 : 1;
}

function checkForWin() {
  function checkWin(cells) {
    return cells.every(([y, x]) =>
      y >= 0 &&
      y < HEIGHT &&
      x >= 0 &&
      x < WIDTH &&
      board[y][x] === currPlayer
    );
  }

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (checkWin(horiz) || checkWin(vert) || checkWin(diagDR) || checkWin(diagDL)) {
        return true;
      }
    }
  }

  return false;
}

function boardIsFull() {
  return board.every(row => row.every(cell => cell));
}

createHtmlBoard();
