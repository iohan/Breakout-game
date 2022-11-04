const canvas = document.getElementById("gameCanvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

/** ----------------
 * INITIAL VALUES
 */
const playerWidth = 100;
const playerHeight = 10;
let playerX, playerY, playerSpeed;

const ballSize = 10;
let ballX, ballY, ballDirectionX, ballDirectionY;

const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

const bricks = bricksArray();

let startGame = false;
let rightKeyPressed = false;
let leftKeyPressed = false;

const setInitialValues = () => {
  playerX = canvas.width / 2 - playerWidth / 2;
  playerY = canvas.height - 30;
  playerSpeed = 2.5;

  ballX = playerX + playerWidth / 2;
  ballY = playerY - ballSize - 1;
  ballDirectionX = 2;
  ballDirectionY = -2;
};

/** ----------------
 * OBJECTS
 */

function bricksArray() {
  const arr = [];
  for (let col = 0; col < brickColumnCount; col++) {
    arr[col] = [];
    for (let row = 0; row < brickRowCount; row++) {
      arr[col][row] = { x: 0, y: 0, hide: false };
    }
  }
  return arr;
}

const drawBricks = () => {
  for (let col = 0; col < brickColumnCount; col++) {
    for (let row = 0; row < brickRowCount; row++) {
      if (!bricks[col][row].hide) {
        const brickX = col * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = row * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[col][row].x = brickX;
        bricks[col][row].y = brickY;

        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#5c949f";
        if (col === 2 && row === 2) {
          ctx.fillStyle = "#ff0000";
        }
        ctx.fill();
        ctx.closePath();
      }
    }
  }
};

const drawStartText = () => {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  ctx.beginPath();
  ctx.textAlign = "center";
  ctx.font = "22px sans-serif";
  ctx.fillStyle = "black";
  ctx.fillText("JAVASCRIPT", centerX, centerY - 40);
  ctx.font = "35px sans-serif";
  ctx.fillText("BREAKOUT GAME", centerX, centerY);
  ctx.font = "14px sans-serif";
  ctx.fillStyle = "#aaa";
  ctx.fillText("Built by Johan Östling 2022", centerX, centerY + 30);
  ctx.font = "18px sans-serif";
  ctx.fillStyle = "black";
  ctx.fillText("- PRESS SPACE TO PLAY -", centerX, centerY + 80);
  ctx.closePath();
};

const drawBall = () => {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
  ctx.fillStyle = "#5c949f";
  ctx.fill();
  ctx.closePath();
};

const drawPlayer = () => {
  ctx.beginPath();
  ctx.rect(playerX, playerY, playerWidth, playerHeight);
  ctx.fillStyle = "#5c949f";
  ctx.fill();
  ctx.closePath();
};

/** ----------------
 * OBJECTS X,Y POINTS
 */
const ballTop = () => ballY - ballSize / 2;
const ballRight = () => ballX + ballSize / 2;
const ballLeft = () => ballX - ballSize / 2;
const ballBottom = () => ballY + ballSize / 2;
const ballCenter = () => ballX + ballSize / 2;
const playerTop = () => playerY;
const playerLeft = () => playerX;
const playerRight = () => playerX + playerWidth;
const wallRight = () => canvas.width;
const wallLeft = () => 0;
const wallTop = () => 0;
const wallBottom = () => canvas.height;

/** ----------------
 * OBJECT MOVEMENT
 */

const moveBall = () => {
  ballX += ballDirectionX;
  ballY += ballDirectionY;
};

const movePlayer = () => {
  if (rightKeyPressed) {
    if (playerRight() <= wallRight() - 2) {
      playerX += playerSpeed;
    }
  } else if (leftKeyPressed) {
    if (playerLeft() >= wallLeft() + 2) {
      playerX -= playerSpeed;
    }
  }
};

/** ----------------
 * HELPER FUNCTIONS
 */

/**
 * Inverts the number (direction) and returns it
 * e.g -2 returns 2, 2 returns -2
 *
 * @param {number} direction
 * @returns inverted number (direction)
 */
const changeDirection = (direction) => direction * -1;

/** ----------------
 * DETECTION
 */

const detectBricks = () => {
  const b = {
    x: { a: ballTop(), b: ballBottom(), c: ballY, w: ballSize },
    y: { a: ballLeft(), b: ballRight(), c: ballX, w: ballSize },
  };

  for (let col = 0; col < brickColumnCount; col++) {
    for (let row = 0; row < brickRowCount; row++) {
      if (!bricks[col][row].hide) {
        const brickTop = bricks[col][row].y;
        const brickBottom = brickTop + brickHeight;
        const brickLeft = bricks[col][row].x;
        const brickRight = brickLeft + brickWidth;

        // a = top/left points, b = bottom/right points, c = center points
        const br = {
          x: {
            a: brickTop,
            b: brickBottom,
            c: brickTop + brickHeight / 2,
            w: brickHeight,
          },
          y: {
            a: brickLeft,
            b: brickRight,
            c: brickLeft + brickWidth / 2,
            w: brickWidth,
          },
        };

        // TOP/BOTTOM LEFT || RIGHT
        if (
          ((b.y.c < br.y.c && br.y.a - b.y.a < b.y.w) ||
            (b.y.c > br.y.c && b.y.b - br.y.b < b.y.w)) &&
          ((b.x.c > br.x.c && b.x.b - br.x.b < b.x.w) ||
            (b.x.c < br.x.c && br.x.a - b.x.a < b.x.w))
        ) {
          bricks[col][row].hide = true;
          ballDirectionY = changeDirection(ballDirectionY);
        }
      }
    }
  }
};

const detectWalls = () => {
  // Right - Left
  if (
    ballRight() >= wallRight() - ballSize / 2 ||
    ballLeft() <= wallLeft() + ballSize / 2
  ) {
    ballDirectionX = changeDirection(ballDirectionX);
  }
  // Top
  if (ballTop() <= wallTop() + ballSize / 2) {
    ballDirectionY = changeDirection(ballDirectionY);
  }

  // Bottom = Game Over
  if (ballTop() > wallBottom() + ballSize / 2) {
    gameOver();
  }
};

const detectPlayer = () => {
  if (ballBottom() >= playerTop() - 2 && ballBottom() <= playerTop() + 2) {
    if (
      ballLeft() >= playerLeft() - ballSize &&
      ballRight() <= playerRight() + ballSize
    ) {
      ballDirectionY = changeDirection(ballDirectionY);
    }
  }
};

const collisionDetect = () => {
  detectBricks();
  detectWalls();
  detectPlayer();
};

/** ----------------
 * KEYBOARD CONTROLS
 */

const keyDownHandler = (e) => {
  e.preventDefault();
  if (e.key === "Left" || e.key === "ArrowLeft") {
    leftKeyPressed = true;
  } else if (e.key === "Right" || e.key === "ArrowRight") {
    rightKeyPressed = true;
  }
};

const keyUpHandler = (e) => {
  e.preventDefault();
  if (e.key === "Left" || e.key === "ArrowLeft") {
    leftKeyPressed = false;
  } else if (e.key === "Right" || e.key === "ArrowRight") {
    rightKeyPressed = false;
  } else if (e.key === " " || e.key === "Space" || e.key === 32) {
    startGame = true;
  }
};

/** ----------------
 * RUNTIME OPERATIONS
 */

const runtime = () => {
  if (startGame) {
    draw();
  }
};

const gameOver = () => {
  startGame = false;
  console.log("GAME OVER!");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  setInitialValues();

  draw();
};

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!startGame) {
    drawStartText();
  } else {
    drawBricks();
  }
  drawBall();
  drawPlayer();

  collisionDetect();

  moveBall();
  movePlayer();
};

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

setInitialValues();

// Initial Draw of Game
draw();

// Starting runtime loop
setInterval(runtime, 10);
