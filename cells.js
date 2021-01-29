// MAZE-GAME: developed using p5.js, HTML and CSS

function getNeighbour(i, j) {
  // Boundary Checks
  if (i < 0 || j < 0 || (i >= cols) | (j >= rows)) {
    return undefined;
  }
  return grid[i][j];
}

function getRandomIndex(indexAlreadyChosen) {
  let index2 = indexAlreadyChosen;
  while (index2 == indexAlreadyChosen) {
    index2 = Math.floor(Math.random() * 4);
  }
  return index2;
}

function correspondingWall(index, i, j) {
  // BOUNDARY CHECKS!!!
  if (index == 0 && j != 0) {
    // bottom wall of top cell
    grid[i][j - 1].walls[2] = false;
  } else if (index == 1 && i != 0) {
    // right wall of left cell
    grid[i - 1][j].walls[3] = false;
  } else if (index == 2 && j < grid[i].length - 1) {
    // top wall of bottom cell
    grid[i][j + 1].walls[0] = false;
  } else if (index == 3 && i < grid.length - 1) {
    // left wall of right cell
    grid[i + 1][j].walls[1] = false;
  }
}

function Cell(i, j) {
  this.i = i;
  this.j = j;
  // [top, left, bottom, right]
  this.walls = [true, true, true, true];
  // If Cell has been visited
  this.visited = false;

  // Method to actually create the Maze
  this.updateWalls = () => {
    let wall1 = Math.floor(Math.random() * 4);
    let wall2 = getRandomIndex(wall1);
    this.walls[wall1] = false;
    this.walls[wall2] = false;

    correspondingWall(wall1, this.i, this.j);
    correspondingWall(wall2, this.i, this.j);
  };

  // Neighbouring Cells
  this.neighbours = () => {
    let top = getNeighbour(i, j - 1);
    let left = getNeighbour(i - 1, j);
    let bottom = getNeighbour(i, j + 1);
    let right = getNeighbour(i + 1, j);

    let arrayOfNeighbours = [top, left, bottom, right];
    return arrayOfNeighbours;
  };

  // Used to highlight current cell
  this.highlight = () => {
    let x = this.i * cellWidth;
    let y = this.j * cellWidth;
    noStroke();
    fill(255, 255, 100);
    rect(x, y, cellWidth, cellWidth);
  };

  this.show = () => {
    // (x, y): top-left corner of cell
    // x: left -> right
    let x = this.i * cellWidth;
    // y: up -> down
    let y = this.j * cellWidth;

    // Colour of cell edges
    stroke(255, 255, 255);

    // top
    if (this.walls[0] && this.j != 0) {
      line(x, y, x + cellWidth, y);
    }
    // left
    if (this.walls[1] && this.i != 0) {
      line(x, y, x, y + cellWidth);
    }
    // bottom
    if (this.walls[2] && this.j < grid[0].length - 1) {
      line(x, y + cellWidth, x + cellWidth, y + cellWidth);
    }
    // right
    if (this.walls[3] && this.i < grid.length - 1) {
      line(x + cellWidth, y, x + cellWidth, y + cellWidth);
    }

    // Highlights cells already visited
    if (this.visited) {
      noStroke();
      fill(50, 50, 100);
      rect(x, y, cellWidth, cellWidth);
    }
  };
}
