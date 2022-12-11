screenWidth = 400
screenHeight = 400

ballX = 30;
ballY = screenHeight/2;
ballRad = 10;

ballXVel = 2;
ballYVel = 1;

paddle = [20, 280, 100, 280]
paddle = [150, 280, 300, 200]

let a;
let b;


function convRadians(degrees){
  var pi = Math.PI;
  return degrees * (pi/180);
}

function convDegrees(radians){
  var pi = Math.PI;
  return radians / (pi/180);
}

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
    //console.log('paddle')
    ballVel = Math.sqrt(ballXVel**2+ballYVel**2) //2.23
    ballAngle = Math.atan(ballYVel/ballXVel); //26.6

    paddleAngle = -Math.atan((paddle[3]-paddle[1])/(paddle[2]-paddle[0])) //0

    angle = -((ballAngle+paddleAngle)+paddleAngle) //26.6

    if (ballXVel < 0) {
      angle += Math.PI
    }

    

    newXVel = ballVel*Math.cos(angle);
    newYVel = ballVel*Math.sin(angle);
    console.log(ballXVel, ballYVel, newXVel, newYVel, ballX, ballY, convDegrees(ballAngle), ballVel, convDegrees(paddleAngle), convDegrees(angle));
    //console.log
    
    a = ballX;
    b = ballY;

    ballX -= ballXVel;
    ballY -= ballYVel;

    ballXVel = newXVel;
    ballYVel = newYVel;

    ballX += ballXVel;
    ballY += ballYVel;
    
    //console.log()

    
  }

  //console.log(xIntersect)

  background(0);
  fill(255)
  noStroke()
  circle(ballX, ballY, ballRad*2)
  stroke(255)
  strokeWeight(4)
  line(paddle[0], paddle[1], paddle[2], paddle[3])

  
  fill(255,0,0)
  noStroke()
  circle(a, b, ballRad*2)
}