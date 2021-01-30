// MAZE-GAME: developed using p5.js, HTML and CSS

let cols, rows;
const cellWidth = 20;
let width = 700;
let height = 440;
let grid = [];

let currentCell;
let boundaries = [false, false, false, false];
let gameEnded = false;

// TIME
let startTime;
let currentTime;
let timeDiff;
let bestTime = Number.MAX_SAFE_INTEGER;
let timer;
let resetTimer = true;

// SCORES
let numOfMoves = 0;
let bestScore = Number.MAX_SAFE_INTEGER;

// SIZE
let sizeChange = false;
let small = true;
let large = false;
// SPEED
let fastSpeed = false;

// *** EVENT-LISTENERS ***

// Updating Time
let updateTimer = document.querySelector(".time-elapsed");

function startTimer() {
  timer = setInterval(() => {
    currentTime = new Date();
    timeDiff = currentTime - startTime;
    // ms -> s
    timeDiff /= 1000;
    // 1 decimal point
    timeDiff = timeDiff.toFixed(1);
    updateTimer.innerText = "Time Elapsed: " + timeDiff + "s";
  }, 0);
}
function stopTimer() {
  window.clearInterval(timer);
}

// Restarting Game
let restartBtn = document.querySelector(".restart-game");
restartBtn.addEventListener("click", () => {
  document.querySelector(".win").classList.toggle("congrats-div");
  document.querySelector(".win").classList.toggle("congrats");
  document.querySelector(".restart-game").classList.toggle("restart-btn");
  document.querySelector(".restart-game").classList.toggle("restart");
  resetGame();
  // Reset number of Moves
  numOfMoves = 0;
  document.querySelector(".moves").innerHTML = "Moves: " + numOfMoves;
  // Reset Time Elapsed
  document.querySelector(".time-elapsed").innerHTML = "Time Elapsed: 0s";
});

// Generating New Maze
let newMaze = document.querySelector(".new-maze");
newMaze.addEventListener("click", () => {
  resetGame();
});

// Changing Size
let changeToSmall = document.querySelector(".small");
let changeToLarge = document.querySelector(".large");

changeToSmall.addEventListener("click", () => {
  changeToSmall.classList.add("selected");
  changeToLarge.classList.remove("selected");
  if (!small) {
    width = 700;
    height = 440;
    small = true;
    large = false;
    sizeChange = true;
    setup();
  }
});

changeToLarge.addEventListener("click", () => {
  changeToSmall.classList.remove("selected");
  changeToLarge.classList.add("selected");
  if (!large) {
    width = 900;
    height = 540;
    small = false;
    large = true;
    sizeChange = true;
    setup();
  }
});

// Changing Speed
let changeToSlow = document.querySelector(".slow");
let changeToFast = document.querySelector(".fast");

changeToSlow.addEventListener("click", () => {
  changeToSlow.classList.add("selected");
  changeToFast.classList.remove("selected");
  frameRate(10);
  fastSpeed = false;
});

changeToFast.addEventListener("click", () => {
  changeToSlow.classList.remove("selected");
  changeToFast.classList.add("selected");
  frameRate(100);
  fastSpeed = true;
});

// -----------------------------------------------

function setup() {
  createCanvas(width, height);
  rows = height / cellWidth;
  cols = width / cellWidth;

  if (fastSpeed) {
    frameRate(100);
  } else {
    frameRate(10);
  }

  if (sizeChange) {
    grid = [];
    sizeChange = false;
  }

  // Creating Cells
  for (let i = 0; i < cols; i++) {
    let tempArray = [];
    for (let j = 0; j < rows; j++) {
      let cell = new Cell(i, j);
      tempArray.push(cell);
    }
    grid.push(tempArray);
  }
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].updateWalls();
    }
  }
  // Starting position of cell in maze
  currentCell = grid[floor(grid.length / 2)][floor(grid[0].length / 2)];
}

function draw() {
  background(51);

  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[row].length; column++) {
      grid[row][column].show();
    }
  }
  currentCell.visited = true;
  currentCell.highlight();
}

function keyPressed() {
  let neighbours = currentCell.neighbours();

  if (gameEnded) {
    return;
  } else if (keyCode == UP_ARROW) {
    updateMovement(neighbours[0], 0, 2);
  } else if (keyCode == LEFT_ARROW) {
    updateMovement(neighbours[1], 1, 3);
  } else if (keyCode == DOWN_ARROW) {
    updateMovement(neighbours[2], 2, 0);
  } else if (keyCode == RIGHT_ARROW) {
    updateMovement(neighbours[3], 3, 1);
  }

  if (resetTimer && !gameEnded) {
    startTime = new Date();
    startTimer();
    resetTimer = false;
  }
}

function updateMovement(nextCell, wallIndex, nextWallIndex) {
  if (nextCell == undefined) {
    endOfGame();
  } else if (!currentCell.walls[wallIndex] && !nextCell.walls[nextWallIndex]) {
    nextCell.visited = true;
    currentCell = nextCell;
    updateMoves();
  }
}

function endOfGame() {
  // Update Best Score
  gameEnded = true;
  if (numOfMoves < bestScore) {
    bestScore = numOfMoves;
    document.querySelector(".best-score").innerHTML =
      "Best Score: " + bestScore;
  }
  // Update Time
  stopTimer();
  resetTimer = true;
  timeDiff = new Number(timeDiff);
  bestTime = new Number(bestTime);
  if (timeDiff < bestTime) {
    bestTime = timeDiff;
    timeDiff = 0;
    document.querySelector(".best-time").innerHTML = "Best Time: " + bestTime + "s";
  }
  // Display congrats message + option to play again
  document.querySelector(".win").classList.toggle("congrats");
  document.querySelector(".win").classList.toggle("congrats-div");
  document.querySelector(".restart-game").classList.toggle("restart");
  document.querySelector(".restart-game").classList.toggle("restart-btn");
}

function updateMoves() {
  // Update Number of Moves made
  numOfMoves++;
  document.querySelector(".moves").innerHTML = "Moves: " + numOfMoves;
}

function resetGame() {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      let cell = grid[i][j];
      cell.visited = false;
      cell.walls = [true, true, true, true];
      currentCell = grid[floor(grid.length / 2)][floor(grid[0].length / 2)];
    }
  }
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].updateWalls();
    }
  }
  gameEnded = false;
}
