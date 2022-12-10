screenWidth = 400
screenHeight = 400

ballX = screenWidth/2;
ballY = screenHeight/2;
ballRad = 10;

ballXVel = 2;
ballYVel = 1;

paddle = [370, 280, 300, 280]

function setup() {
  createCanvas(screenWidth, screenHeight);
}

function draw() {
  ballX += ballXVel;
  if (ballX < ballRad) {
    ballX -= ballXVel;
    ballXVel = -ballXVel;
  }
  if (ballX >= screenWidth-ballRad) {
    ballX -= ballXVel;
    ballXVel = -ballXVel;
  }

  
  ballY += ballYVel;
  if (ballY < ballRad) {
    ballY -= ballYVel;
    ballYVel = -ballYVel;
  }
  if (ballY >= screenHeight-ballRad) {
    ballY -= ballYVel;
    ballYVel = -ballYVel;
  }


  background(0);
  fill(255)
  stroke(255)
  circle(ballX, ballY, ballRad*2)
  strokeWeight(4)
  line(paddle[0], paddle[1], paddle[2], paddle[3])
}