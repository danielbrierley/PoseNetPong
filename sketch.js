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
  //update ball velocity
  ballX += ballXVel;
  ballY += ballYVel;

  //Bounds
  if (ballX < ballRad) { //left
    ballX -= ballXVel;
    ballXVel = -ballXVel;
  }
  if (ballX >= screenWidth-ballRad) { //right
    ballX -= ballXVel;
    ballXVel = -ballXVel;
  }
  if (ballY < ballRad) { //top
    ballY -= ballYVel;
    ballYVel = -ballYVel;
  }
  if (ballY >= screenHeight-ballRad) { //bottom
    ballY -= ballYVel;
    ballYVel = -ballYVel;
  }


  if (Math.abs(ballYVel) > Math.abs(ballXVel)) {

  }

  ai = Math.atan(ballXVel/ballYVel)

  //console.log(convDegrees(ai))
  
  //GET BALL EQUATION (y = mx + c)
  mb = ballYVel/ballXVel;
  cb = ballY-(ballX*mb);
  //console.log(mb, cb)

  //GET PADDLE EQUATION (y = mx + c)
  paddleXDiff = paddle[2]-paddle[0];
  paddleYDiff = paddle[3]-paddle[1];
  mp = paddleYDiff/paddleXDiff;
  cp = paddle[1]-(paddle[0]*mp);
  // console.log(mp, cp)

  //CALCULATE INTERSECTION POINT by solving equations for x
  xIntersect = (cp-cb)/(mb-mp)

  if (paddle[0] <= paddle[2]) {
    paddleLeft  = paddle[0]; 
    paddleRight = paddle[2];
  } 
  else {
    paddleLeft  = paddle[2]; 
    paddleRight = paddle[0];
  }

  ballPrev = ballX-ballXVel;
  if (ballPrev <= ballX) {
    ballLeft = ballPrev;
    ballRight = ballX;
  }
  else {
    ballLeft = ballX;
    ballRight = ballPrev;
  }

  if (xIntersect >= paddleLeft && xIntersect < paddleRight && xIntersect >= ballLeft && xIntersect < ballRight) {
    console.log('paddle')
  }

  //console.log(xIntersect)

  background(0);
  fill(255)
  stroke(255)
  circle(ballX, ballY, ballRad*2)
  strokeWeight(4)
  line(paddle[0], paddle[1], paddle[2], paddle[3])
}