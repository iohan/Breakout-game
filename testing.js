const canvas = document.getElementById("testCanvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

let circleX = 40,
  circleY = 40,
  circleSize = 60;

let rectWidth = 100,
  rectHeight = 100;
let rectLeft = canvas.width / 2 - rectWidth / 2;
let rectTop = canvas.height / 2 - rectHeight / 2;
let rectRight = rectLeft + rectWidth;
let rectBottom = rectTop + rectHeight;

const hit = { top: false, left: false, right: false, bottom: false };

const circleTop = () => circleY - circleSize / 2;
const circleRight = () => circleX + circleSize / 2;
const circleLeft = () => circleX - circleSize / 2;
const circleBottom = () => circleY + circleSize / 2;
const circleCenter = () => circleX + circleSize / 2;

const drawCircle = () => {
  ctx.beginPath();
  ctx.arc(circleX, circleY, circleSize / 2, 0, Math.PI * 2);
  ctx.fillStyle = "green";
  ctx.fill();
  ctx.closePath();
};

const drawRectangle = (hit) => {
  ctx.beginPath();
  ctx.rect(rectLeft, rectTop, rectWidth, rectHeight);
  let rectColor = "red";
  if (hit.top) {
    rectColor = "blue";
  } else if (hit.bottom) {
    rectColor = "pink";
  } else if (hit.left) {
    rectColor = "yellow";
  } else if (hit.right) {
    rectColor = "purple";
  }
  ctx.fillStyle = rectColor;
  ctx.fill();
  ctx.closePath();
};

const circlePoint = () => Math.cos(Math.PI / 4) * (circleSize / 2);

const collisionDetect = () => {
  hit.top = false;
  hit.bottom = false;
  hit.left = false;
  hit.right = false;

  /*if (circleBottom() >= rectTop && circleRight() - circleSize / 4 >= rectLeft && circleLeft() + circleSize / 4 <= rectRight) {
    // HIT TOP
    hit.top = true;
    hit.bottom = false;
    hit.left = false;
    hit.right = false;
  } else if (circleTop() <= rectBottom && circleRight() - circleSize / 4 >= rectLeft && circleLeft() + circleSize / 4 <= rectRight) {
    // HIT BOTTOM
    hit.top = false;
    hit.bottom = true;
    hit.left = false;
    hit.right = false;
  }*/

  // CLEAN HITS WORKING TOP/BOTTOM/LEFT/RIGHT
  if (circleBottom() >= rectTop && circleX >= rectLeft && circleX <= rectRight) {
    // HIT TOP
    hit.top = true;
    hit.bottom = false;
    hit.left = false;
    hit.right = false;
  }
  if (circleTop() >= rectBottom && circleX >= rectLeft && circleX <= rectRight) {
    // HIT BOTTOM
    hit.top = false;
    hit.bottom = true;
    hit.left = false;
    hit.right = false;
  }
  if (circleRight() >= rectLeft && circleY >= rectTop && circleY <= rectBottom) {
    // HIT LEFT
    hit.top = false;
    hit.bottom = false;
    hit.left = true;
    hit.right = false;
  }
  if (circleLeft() >= rectRight && circleY >= rectTop && circleY <= rectBottom) {
    // HIT RIGHT
    hit.top = false;
    hit.bottom = false;
    hit.left = false;
    hit.right = true;
  }
};

const keyDownHandler = (e) => {
  let step = 10;
  console.log(hit);
  if (e.key === "Left" || e.key === "ArrowLeft") {
    if (!hit.right) {
      circleX -= step;
    }
  } else if (e.key === "Right" || e.key === "ArrowRight") {
    if (!hit.left) {
      circleX += step;
    }
  } else if (e.key === "Up" || e.key === "ArrowUp") {
    if (!hit.bottom) {
      circleY -= step;
    }
  } else if (e.key === "Down" || e.key === "ArrowDown") {
    if (!hit.top) {
      circleY += step;
    }
  }
};

const run = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  collisionDetect();
  drawRectangle(hit);
  drawCircle();
};

document.addEventListener("keydown", keyDownHandler, false);

setInterval(run, 10);
