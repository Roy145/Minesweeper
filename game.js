'use strict';

const MINE = '💣';
const SAD = '😢';
const HAPPY = '😀';
const LIVES = '💕';

var gBoard;
var gLevel;
var gGame;
var gMinesLocation;
var gStartTime;
var gIntervalId;

function initGame() {
  gLevel = play();
  renderBoard(gBoard, '.board-container');
  renderCell(location);
}

function play(size = 4, mines = 2) {
  gBoard = {
    minesAroundCount: 4,
    isShown: true,
    isMine: false,
    isMarked: true,
  };

  gLevel = {
    size: size,
    mines: mines,
    minesAdded: mines,
  };

  gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
  };
  renderBoard(gBoard, '.board-container');
  gBoard = buildBoard(gLevel.size);
  return gLevel;
}
function buildBoard(size) {
  var board = [];
  for (var i = 0; i < size; i++) {
    board.push([]);
    for (var j = 0; j < size; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      };
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
      strHTML += `<td class="${className}" onclick="cellClicked({i:${i}, j:${j}}, this)" onmousedown="cellMarked(event,{i:${i}, j:${j}}, this)">${cell}</td>`;
    }
    strHTML += '</tr>';
  }
  strHTML += '</tbody></table>';
  var elContainer = document.querySelector('.board-container');
  elContainer.innerHTML = strHTML;
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

function cellClicked(elCell) {}

function cellMarked(elCell) {}

function checkGameOver() {}

function expandShown(board, elCell, i, j) {}
