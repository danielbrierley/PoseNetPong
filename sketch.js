
let video;
let poseNet;
let poses = [];
let predictions = [];
let handpose;

let screenWidth = 640
let screenHeight = 480

let ballX = 30;
let ballY = screenHeight/2;
let ballRad = 10;

let ballXVel = 2;
let ballYVel = 1;

let paddles = []

let a;
let b;

let modelsLoaded = 0;
let modelLoaded = false;
let handposeLoaded = false;
let posenetLoaded = false;


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
  video = createCapture(VIDEO);
  video.size(width, height);
  
  poseNet = ml5.poseNet(video, posenetReady2);

 
  video.hide();
}

function posenetReady2() {
  modelLoaded = true;
  handposeLoaded = true;
  poseNet.on('pose', posenetCallback)
  //poseNet.off('pose', posenetCallback);
}

function posenetReady() {
  console.log("PoseNet ready");
  posenetLoaded = true;
  handpose = ml5.handpose(video, handposeReady);
  
}

function handposeReady() {
  console.log("HandPose ready");
  modelLoaded = true;
  handposeLoaded = true;
  handpose.on("predict", handposeCallback);
  handpose.off("predict", handposeCallback);
  poseNet.on('pose', posenetCallback)
  poseNet.off('pose', posenetCallback);
  handpose = null;
  //handpose.off("predict");
}

function posenetCallback(results) {
  poses = results
}

function handposeCallback(results) {
  predictions = results
}

function setPaddles() {

}

function drawKeypoints() {
  i = 0;
  //for (i = 0; i < poses.length; i++) {
  if(poses[0]) {
    
    let pose = poses[i].pose;

    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      fill(255,0,0);
      noStroke();
      ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      textSize(32);
      text(j.toString(), keypoint.position.x, keypoint.position.y)
    }
  }
  if (predictions[0]) {
    //console.log(predictions.length);
    p = 0
    //for (p = 0; p < predictions.length; p++) {
        
    const prediction = predictions[p];
    //console.log(prediction.landmarks);
    for (let j = 0; j < prediction.landmarks.length; j += 1) {
      const keypoint = prediction.landmarks[j];

      //stroke(0,255,0);
      //line(keypoint[0], keypoint[1], oldKeypoint[0], oldKeypoint[1]);      
      fill(0, 255, 0);
      noStroke();
      ellipse(keypoint[0], keypoint[1], 10, 10);
      //textSize(32);
      //text(j.toString(), keypoint[0], keypoint[1])
      oldKeypoint = keypoint;
    }
  }
}

function draw() {
  if (modelLoaded) {
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
  
    for (i = 0; i < paddles.length; i++) { //paddles
      paddle = paddles[i]
  
      paddleAngle = -Math.atan((paddle[3]-paddle[1])/(paddle[2]-paddle[0])); //0
  
  
  
      xDir = ballXVel/Math.abs(ballXVel);
      yDir = ballYVel/Math.abs(ballYVel);
      xChange = yDir*ballRad*Math.sin(paddleAngle);
      yChange = yDir*ballRad*Math.cos(paddleAngle);
  
      ballXp = ballX+xChange;
      ballYp = ballY+yChange;
  
      //console.log(xChange, yChange, xDir, yDir)
      //console.log(convDegrees(ai))
      
      //GET BALL EQUATION (y = mx + c)
      mb = ballYVel/ballXVel;
      cb = ballYp-(ballXp*mb);
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
  
      ballPrev = ballXp-ballXVel;
      if (ballPrev <= ballXp) {
        ballLeft = ballPrev;
        ballRight = ballXp;
      }
      else {
        ballLeft = ballXp;
        ballRight = ballPrev;
      }
  
      if (xIntersect >= paddleLeft && xIntersect < paddleRight && xIntersect >= ballLeft && xIntersect < ballRight) {
        //console.log('paddle')
        ballVel = Math.sqrt(ballXVel**2+ballYVel**2) //2.23
        ballAngle = Math.atan(ballYVel/ballXVel); //26.6
  
        paddleAngle = -Math.atan(paddleYDiff/paddleXDiff) //0
  
        angle = -((ballAngle+paddleAngle)+paddleAngle) //26.6
  
        if (ballXVel < 0) {
          angle += Math.PI
        }
  
        
  
        newXVel = ballVel*Math.cos(angle);
        newYVel = ballVel*Math.sin(angle);
        //console.log(ballXVel, ballYVel, newXVel, newYVel, ballXp, ballYp, convDegrees(ballAngle), ballVel, convDegrees(paddleAngle), convDegrees(angle));
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
    }
  
    //console.log(xIntersect)
  
    background(0);
    image(video, 0, 0, width, height);
    fill(255)
    noStroke()
    circle(ballX, ballY, ballRad*2)
    stroke(255)
    strokeWeight(4)
    for (i = 0; i < paddles.length; i++) {
      paddle = paddles[i]
      line(paddle[0], paddle[1], paddle[2], paddle[3]);
    }
  
    
    fill(255,0,0)
    noStroke()
    //circle(a, b, ballRad*2)
    fill(0,255,0)
    //circle(ballXp, ballYp, 2)
  
    drawKeypoints()

  }
  else {
    background(0);
    fill(255)
    text('Model loading...', 0, 20);
    if (posenetLoaded)  {
      text('PoseNet Loaded', 0, 40);
    }
    if (handposeLoaded)  {
      text('HandPose Loaded', 0, 60);
    }

  }
}