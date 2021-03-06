document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  let squares = Array.from(document.querySelectorAll('.grid div'));
  const scoreDisplay = document.querySelector('#score');
  const startBtn = document.querySelector('#start-button');
  const width = 10;
  let nextRandom = 0;
  let timerId;
  let score = 0;
  const colors = [
    'grey',
    'red',
    'purple',
    'blue',
    'green'
  ];

  //The tetrominoes

  const lTetromino = [
    [1, width + 1, 2*width + 1, 2],
    [width + 1, width, width + 2, 2*width + 2],
    [1, width + 1, 2*width + 1, 2*width],
    [width, 2*width, 2*width + 1, 2*width + 2]
  ];

  const tTetromino = [
    [1, width + 1, 2*width + 1, width + 2],
    [1, width, width + 1, width + 2],
    [1, width +1, 2*width + 1, width],
    [width, width +1, width + 2, 2*width + 1]

  ];

  const zTetromino = [
    [2, width + 2, width + 1, 2*width + 1],
    [0, 1, width + 1, width + 2],
    [2, width + 2, width + 1, 2*width + 1],
    [0, 1, width + 1, width + 2]

  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ];

  const iTetromino = [
    [1, width + 1, 2*width + 1, 3*width + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, 2*width + 1, 3*width + 1],
    [width, width + 1, width + 2, width + 3]
  ];


  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

  let currentPosition = 4;
  let currentRotation = 0;
  let random = Math.floor(Math.random()*theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

//draw the tetromino
  function draw() {
      current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino');
        squares[currentPosition + index].style.backgroundColor = colors[random];
      })
  }


//undraw the tetromino
function undraw() {
  current.forEach(index => {
    squares[currentPosition + index].classList.remove('tetromino');
    squares[currentPosition + index].style.backgroundColor = '';
})
}


//makes the tetromino move down
//timerId = setInterval(moveDown, 500);

//assign functions to keycodes
function control(e) {
    if(e.keyCode === 37)
     {
      moveLeft()
     }
     else if (e.keyCode === 38)
     {
       rotate();
     }
     else if(e.keyCode === 39)
     {
       moveRight();
     }
     else if(e.keycode === 40)
     {
       moveDown();
     }
  }
document.addEventListener('keyup', control)


//move down function
function moveDown() {
  undraw();
  currentPosition += width;
  draw();
  freeze();
}


//freeze function
function freeze() {
  if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
    current.forEach(index => squares[currentPosition + index].classList.add('taken'));

    //start a new random tetrominoes
    random = nextRandom;
    nextRandom = Math.floor(Math.random()* theTetrominoes.length);
    current = theTetrominoes[random][currentRotation];
    currentPosition = 4;
    draw();
    displayShape();
    addScore();
    gameOver();
  }
}

//move tetromino left until at the edge/blockage present
function moveLeft() {
   undraw();
   const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
   if(!isAtLeftEdge) currentPosition -=1;
   if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
     currentPosition +=1;
   }
   draw();
 }

 //move tetromino right until at the edge/blockage present
 function moveRight() {
    undraw();
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
    if(!isAtRightEdge) currentPosition +=1;
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -=1;
    }
    draw();
  }

//rotate the tetrominoes
function rotate()
{
  undraw();
  currentRotation ++;
  if(currentRotation === current.length)
  {
    currentRotation = 0;
  }

  // so shapes dont wrap through left wall and into the right
    if(current.some(index => (currentPosition + index) % width === 0))
  {
      currentRotation = 0;
  }

  //so shapes dont wrap through the right wall and into the left
  if(current.some(index => (currentPosition + index) % width === width - 1))
  {
    currentRotation = 2;
  }
 // i tetromino clipping through right wall
  if(random == 4 && current.some(index => (currentPosition + index) % width === width - 2))
  {
    currentRotation = 2;
  }
  current = theTetrominoes[random][currentRotation];
  draw();
}


//show up-next tetrominoes
const displaySquares = document.querySelectorAll('.mini-grid div')
const displayWidth = 4;
let displayIndex = 0;


//The next tetrominoes
const upNextTetrominoes = [
  [1,displayWidth + 1, displayWidth*2 + 1,2],
  [0, displayWidth, displayWidth + 1, displayWidth*2 + 1],
  [1, displayWidth, displayWidth + 1, displayWidth + 2],
  [0, 1, displayWidth, displayWidth + 1],
  [1, displayWidth + 1, displayWidth*2 + 1, displayWidth*3 +1]
]

//display the shape in mini-grid

function displayShape()
//remove any trace of a tetromino from the grid
{
  displaySquares.forEach(square => {
    square.classList.remove('tetromino')
    square.style.backgroundColor = "";
  })
  upNextTetrominoes[nextRandom].forEach(index => {
    displaySquares[displayIndex + index].classList.add('tetromino');
    displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
  })
}


//add functionality to the button
startBtn.addEventListener('click', () => {
  if(timerId)
  {
    clearInterval(timerId);
    timerId = null;
  }
  else
  {
    timerId = setInterval(moveDown, 500)
    nextRandom = Math.floor(Math.random()*theTetrominoes.length);
    displayShape();
  }
})

//add scoreDisplay
function addScore()
{
  for(let i = 0; i < 199; i += width)
  {
    const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

    if(row.every(index => squares[index].classList.contains('taken')))
      {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
          squares[index].style.backgroundColor = '';
        })
        const squaresRemoved = squares.splice(i,width);
        squares = squaresRemoved.concat(squares);
        squares.forEach(cell => grid.appendChild(cell));
      }
    }
}

//game moveRight
function gameOver()
{
  if(current.some(index => squares[currentPosition + index].classList.contains('taken')))
  {
    scoreDisplay.innerHTML = 'end';
    clearInterval(timerId);
  }
}








})
