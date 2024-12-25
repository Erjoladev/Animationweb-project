document.addEventListener("DOMContentLoaded", function () {
  const livesEl = document.getElementById("lives");
  const livesCtx = livesEl.getContext("2d");
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const startButton = document.getElementById("startGame");
  startButton.innerHTML = '<img src="../images/btnStart.png" alt="Start Game">';
  const scoreEl = document.getElementById("score");

  const paddleImage = new Image();
  paddleImage.src = "../images/paddle.png";

  let livesSprite = new Image();
  livesSprite.src = "../images/sprite_barre_de_vies.png";

  const successImage = new Image();
  successImage.src = "../images/succes.png";

  anime({
    targets: "#startGame",
    scale: [1, 1.5, 1],
    loop: true,
    duration: 1000,
    easing: "easeInOutSine",
    delay: 500,
  });
  // define variables
  let paddle, ball, bricks;
  let lives = 3;
  let score = 0;
  let ballInPlay = false;
  const rowCount = 3;
  const columnCount = 10;
  let rightPressed = false;
  let leftPressed = false;
  let allBricksDestroyed = false;

  startButton.addEventListener("click", function () {
    document.getElementById("startGame").style.display = "none"; // Hide start button
    showLoadingScreen();
  });

  function showLoadingScreen() {
    const loadingElement = document.getElementById("loadingScreen");
    loadingElement.style.display = "flex";
    setTimeout(() => {
      loadingElement.style.display = "none";
      initGame();
    }, 4000);
  }

  function drawLives() {
    let spriteWidth = livesSprite.width / 4;
    let spriteHeight = livesSprite.height;
    let spriteX = spriteWidth * (3 - lives);

    // Clear the previous drawing
    livesCtx.clearRect(0, 0, livesEl.width, livesEl.height);

    // Draw the specific part of the sprite
    livesCtx.drawImage(
      livesSprite,
      spriteX,
      0,
      spriteWidth,
      spriteHeight,
      0,
      0,
      livesEl.width,
      livesEl.height
    );
  }
  function initGame() {
    canvas.style.display = "block";
    initPaddle();
    initBall();
    initBricks();
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    gameLoop();
  }

  function initPaddle() {
    paddle = {
      width: 100,
      height: 20,
      x: (canvas.width - 100) / 2,
      y: canvas.height - 30,
      dx: 0,
    };
  }

  function initBall() {
    ball = {
      x: canvas.width / 2,
      y: canvas.height - 45,
      radius: 10,
      dx: 0,
      dy: 0,
    };
  }

  function initBricks() {
    const brickWidth = (canvas.width - 30) / columnCount - 10; // Adjust brick width
    const brickHeight = 30;
    bricks = [];
    for (let c = 0; c < columnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < rowCount; r++) {
        let brickX = c * (brickWidth + 10) + 20; // Uniform padding
        let brickY = r * (brickHeight + 10) + 30;
        bricks[c][r] = { x: brickX, y: brickY, status: 1 };
      }
    }
  }

  function keyDownHandler(e) {
    // if (e.key === "Right" || e.key === "ArrowRight") {
    //   paddle.x += 7;
    // } else if (e.key === "Left" || e.key === "ArrowLeft") {
    //   paddle.x -= 7;
    // } else if (e.key === " " && !ballInPlay) {
    //   ball.dx = 2;
    //   ball.dy = -2;
    //   ballInPlay = true;
    // }
    if (e.key === "Right" || e.key === "ArrowRight") {
      rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      leftPressed = true;
    } else if (e.key === " " && !ballInPlay) {
      ball.dx = 2;
      ball.dy = -2;
      ballInPlay = true;
    }
  }

  function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
      rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      leftPressed = false;
    }
  }
  function updatePaddlePosition() {
    if (rightPressed) {
      paddle.x += 7;
      if (paddle.x + paddle.width > canvas.width) {
        paddle.x = canvas.width - paddle.width;
      }
    } else if (leftPressed) {
      paddle.x -= 7;
      if (paddle.x < 0) {
        paddle.x = 0;
      }
    }
  }
  function checkAllBricksDestroyed() {
    for (let c = 0; c < columnCount; c++) {
      for (let r = 0; r < rowCount; r++) {
        if (bricks[c][r].status === 1) {
          return false; // Brick found that is not destroyed
        }
      }
    }
    return true; // No bricks left undestroyed
  }

  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    updatePaddlePosition();
    collisionDetection();
    updateBallPosition();

    if (lives > 0) {
      if (!allBricksDestroyed) {
        allBricksDestroyed = checkAllBricksDestroyed();
        if (!allBricksDestroyed) {
          requestAnimationFrame(gameLoop);
        } else {
          displayLevelComplete();
        }
      }
    } else {
      drawLives();
      displayGameOver();
    }
  }
  function drawBricks() {
    for (let c = 0; c < bricks.length; c++) {
      for (let r = 0; r < bricks[c].length; r++) {
        if (bricks[c][r].status === 1) {
          ctx.beginPath();
          ctx.rect(bricks[c][r].x, bricks[c][r].y, 75, 20);
          ctx.fillStyle = "#0095DD";
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }

  function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }

  function drawPaddle() {
    // ctx.beginPath();
    // ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    // ctx.fillStyle = "#0095DD";
    // ctx.fill();
    // ctx.closePath();
    ctx.drawImage(paddleImage, paddle.x, paddle.y, paddle.width, paddle.height);
  }

  function drawScore() {
    scoreEl.innerHTML = "Score: " + score;
  }

  function collisionDetection() {
    bricks.forEach((column) => {
      column.forEach((brick) => {
        if (brick.status == 1) {
          if (
            ball.x > brick.x &&
            ball.x < brick.x + 75 &&
            ball.y > brick.y &&
            ball.y < brick.y + 20
          ) {
            ball.dy = -ball.dy;
            brick.status = 0;
            score += 10;
          }
        }
      });
    });
  }

  function updateBallPosition() {
    if (ballInPlay) {
      ball.x += ball.dx;
      ball.y += ball.dy;
    }

    if (
      ball.x + ball.dx > canvas.width - ball.radius ||
      ball.x + ball.dx < ball.radius
    ) {
      ball.dx = -ball.dx;
    }
    if (ball.y + ball.dy < ball.radius) {
      ball.dy = -ball.dy;
    } else if (
      ball.y + ball.dy > canvas.height - ball.radius - paddle.height &&
      ball.x > paddle.x &&
      ball.x < paddle.x + paddle.width
    ) {
      ball.dy = -ball.dy;
    } else if (ball.y + ball.dy > canvas.height - ball.radius) {
      lives--;
      if (lives > 0) {
        ball.x = canvas.width / 2;
        ball.y = canvas.height - 40;
        ball.dx = 0;
        ball.dy = 0;
        ballInPlay = false; // Reset ball to the paddle
      }
    }
  }

  function displayGameOver() {
    ctx.font = "48px Arial";
    ctx.fillStyle = "#FF0000";
    ctx.fillText("Game Over", canvas.width / 2 - 150, canvas.height / 2);
  }

  function displayLevelComplete() {
    ctx.font = "48px Arial";
    ctx.fillStyle = "#00FF00";
    ctx.fillText("Level Complete", canvas.width / 2 - 150, canvas.height / 2);
    ctx.drawImage(successImage, 0, 0, canvas.width, canvas.height);
  }
});
