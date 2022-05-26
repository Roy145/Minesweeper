'use strict';

const MINE = '💣';
const SAD = '😢';
const HAPPY = '😀';
const LIVES = '💕';
const FLAG = '🚩';
const WIN = '😎';

var gBoard;
var gLevel;
var gGame;
var gMinesLocation;
var gStartTime;
var gInterval;
var gMoves;
var gIsClicked;
var gScore;

function initGame() {
  gLevel = play();
  addRandomMine(gLevel.mines);
  setMinesNegsCount(gBoard);
  renderBoard(gBoard, '.board-container');
  // renderCell(location);
}

function play(size = 4, mines = 2) {
  gBoard = {
    minesAroundCount: 0,
    isShown: true,
    isMine: false,
    isMarked: true,
  };

  gLevel = {
    size: size,
    mines: mines,
  };

  gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3,
  };
  clearInterval(gInterval);

  gMinesLocation = [];
  gMoves = [];
  gBoard = buildBoard(gLevel.size);
  renderBoard(gBoard, '.board-container');

  return gLevel;
}

function buildBoard() {
  var board = [];
  for (var i = 0; i < gLevel.size; i++) {
    board.push([]);
    for (var j = 0; j < gLevel.size; j++) {
      var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      };
      board[i][j] = cell;
    }
  }

  return board;
}

function renderBoard(board, value) {
  var strHTML = '<table border="0"><tbody>';
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < board[0].length; j++) {
      var cell = board[i][j].isShown ? board[i][j].minesAroundCount : ' ';
      var className = `cell cell${i}-${j}`;
      strHTML += `<td class="${className}" data-i="${i}" data-j="${j}" onclick="cellClicked(this)" oncontextmenu="cellMarked(this)">${cell}</td>`;
    }
    strHTML += '</tr>';
  }
  strHTML += '</tbody></table>';
  var elContainer = document.querySelector(value);
  elContainer.innerHTML = strHTML;
}

function renderCell(i, j, value) {
  var elCell = document.querySelector(`.cell${i}-${j}`);
  elCell.innerText = value;
}

function countNeighbors(cellI, cellJ) {
  var neighborsCount = 0;
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i === cellI && j === cellJ) continue;
      if (j < 0 || j >= gBoard[i].length) continue;
      if (gBoard[i][j].isMine) neighborsCount++;
    }
  }
  return neighborsCount;
}

function setMinesNegsCount() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].isMine) continue;
      else gBoard[i][j].minesAroundCount += countNeighbors(i, j);
    }
  }
}

function spreadMines(count) {
  for (var i = 0; i < count; i++) {
    var location = emptyCells();
    gBoard[location.i][location.j] = {
      minesAroundCount: MINE,
      isShown: false,
      isMine: true,
      isMarked: false,
    };
    gMinesLocation.push(location);
  }
}

function cellClicked(elCell) {
  var pos = elCell.dataset;
  // console.log(pos);
  var elLives = document.querySelector('.lives');
  if (!gIsClicked) {
    timer();
    gIsClicked = true;
  }

  if (!gGame.isOn) return;
  elCell.classList.add('shown');
  gBoard[pos.i][pos.j].isShown = true;
  var cell = gBoard[pos.i][pos.j];

  if (cell.isMine === true) {
    elCell.innerText = MINE;
    // console.log(elCell);
  } else if (cell.minesAroundCount === 0) {
    expandShown(gBoard, pos.i, pos.j);
    elCell.innerText = '';
  } else {
    // console.log(elCell);
    elCell.innerText = cell.minesAroundCount;
    // expandShown(gBoard, pos.i, pos.j);
  }

  if (elCell.innerText === MINE) {
    if (gGame.lives === 3) {
      elLives.innerText = 'LIVES LEFT: 💕💕';
      gGame.lives--;
    } else if (gGame.lives === 2) {
      elLives.innerText = 'LIVES LEFT: 💕';
      gGame.lives--;
    } else {
      gGame.isOn = false;
      gameOver(elCell);
    }
  }

  if (checkGameOver()) {
    clearInterval(gInterval);
    var elBtn = document.querySelector('.play-again-btn');
    elBtn.innerText = SAD;
    // console.log(elBtn);
    for (var i = 0; i < gMinesLocation.length; i++) {
      var elMine = document.querySelector(
        `.cell-${gMinesLocation[i].i}-${[gMinesLocation[i].j]}`
      );

      elMine.innerText = MINE;
      elMine.classList.add('shown');
      var mine = gBoard[gMinesLocation[i].i][gMinesLocation[i].j];
      mine.isShown = true;
    }
  }

  gIsClicked++;
}

function cellMarked(elCell) {
  var pos = elCell.dataset;
  // console.log(gBoard[pos.i][pos.j]);
  if (gGame.isOn) {
    if (!gInterval) timer();
    if (gBoard[pos.i][pos.j].isShown) return;
    if (gBoard[pos.i][pos.j].isMarked) {
      gBoard[pos.i][pos.j].isMarked = false;
      elCell.innerText = '';
      renderCell(pos.i, pos.j, '');
    } else {
      gBoard[pos.i][pos.j].isMarked = true;
      elCell.innerText = FLAG;
      renderCell(pos.i, pos.j, FLAG);
    }
  }
}

function resetGame() {
  timer();
  initGame(gLevel.size, gLevel.mines);
  var elBtn = document.querySelector('.play-again-btn');
  elBtn.innerText = HAPPY;
  var elLives = document.querySelector('.lives');
  elLives.innerText = 'LIVES LEFT: ' + LIVES + LIVES + LIVES;
}

function gameOver(elCell) {
  clearInterval(gInterval);
  elCell.classList.add('gameover');
  for (var i = 0; i < gMinesLocation.length; i++) {
    var elMine = document.querySelector(
      `.cell-${gMinesLocation[i].i}-${[gMinesLocation[i].j]}`
    );
    elMine.innerText = MINE;
    elMine.classList.add('shown');
    var mine = gBoard[gMinesLocation[i].i][gMinesLocation[i].j];
    mine.isShown = true;
  }
  var elBtn = document.querySelector('play-again-btn');
  elBtn.innerText = SAD;
}

function checkGameOver() {
  var cellsCount = gBoard.length ** 2;
  var displayCount = 0;
  var minesCount = gMinesLocation.length;
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      if (gBoard[i][j].isShown === true) displayCount++;
    }
  }
  var totalCount = displayCount + minesCount;
  if (cellsCount === totalCount) {
    return true;
  }
  return false;
}

function expandShown(board, idxI, idxJ) {
  for (var i = +idxI - 1; i <= +idxI + 1; i++) {
    if (i < 0 || i > board.length - 1) continue;
    for (var j = +idxJ - 1; j <= +idxJ + 1; j++) {
      if (j < 0 || j > board[0].length - 1) continue;
      if (i === +idxI && j === +idxJ) continue;
      var cell = board[i][j];
      cell.isShown = true;
      var elCell = document.querySelector(`.cell${i}-${j}`);

      elCell.classList.add('shown');
      // console.log(elCell);
      if (cell.minesAroundCount !== 0) {
        elCell.innerText = cell.minesAroundCount;
      }
    }
  }
}

function addRandomMine(amount) {
  var mines = 0;
  while (mines < amount) {
    var pos = {
      i: getRandomInt(0, gBoard.length),
      j: getRandomInt(0, gBoard.length),
    };
    if (gBoard[pos.i][pos.j].isMine === true) continue;
    gBoard[pos.i][pos.j].isMine = true;
    mines++;
    gMinesLocation.push(pos);
  }
}
