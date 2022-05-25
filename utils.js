'user strict';

function renderCell(location, value) {
  var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
  elCell.innerHTML = value;
}

function getClassName(location) {
  var cellClass = 'cell' + location.i + '-' + location.j;
  return cellClass;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function emptyCells() {
  var emptyCells = [];
  for (var i = 0; i < gBoard; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) {
        emptyCells.push({ i, j });
      }
    }
  }
  var emptyCell = emptyCells[getRandomInt(0, emptyCells.length - 1)];
  return emptyCell;
}

function timer() {
  gStartTime = Date.now();
  gIntervalId = setInterval(updateTime, 80);
}

function updateTime() {
  var now = Date.now();
  var diff = now - gStartTime;
  var secondsPast = diff / 1000;
  var elTimerSpan = document.querySelector('.timer');
  elTimerSpan.innerText = secondsPast.toFixed(3);
}
