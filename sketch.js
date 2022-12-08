screenWidth = 400
screenHeight = 400

ballX = screenWidth/2;
ballY = screenHeight/2;
ballRad = 20;

ballXVel = 2;
ballYVel = 1;

function setup() {
  createCanvas(screenWidth, screenHeight);
}

function draw() {
  ballX += ballXVel;
  if (ballX < 0) {
    ballX -= ballXVel;
    ballXVel = -ballXVel;
  }
  if (ballX >= screenWidth) {
    ballX -= ballXVel;
    ballXVel = -ballXVel;
  }

  
  ballY += ballYVel;
  if (ballY < 0) {
    ballY -= ballYVel;
    ballYVel = -ballYVel;
  }
  if (ballY >= screenHeight) {
    ballY -= ballYVel;
    ballYVel = -ballYVel;
  }


  background(0);
  fill(255)
  circle(ballX, ballY, ballRad)
}