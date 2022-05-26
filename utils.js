'user strict';

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
  gInterval = setInterval(updateTime, 80);
}

function updateTime() {
  var now = Date.now();
  var diff = now - gStartTime;
  var secondsPast = diff / 1000;
  var elTimerSpan = document.querySelector('.timer');
  elTimerSpan.innerText = secondsPast.toFixed(3);
}

function toggleGame(elBtn) {
  timerEnd();
  timerReset();
  if (elBtn.innerText === 'Easy') {
    gLevel.size = 4;
    gLevel.mines = 2;
  }
  if (elBtn.innerText === 'Medium') {
    gLevel.size = 8;
    gLevel.mines = 12;
  }
  if (elBtn.innerText === 'Survival') {
    gLevel.size = 12;
    gLevel.mines = 30;
  }
  initGame();
}
