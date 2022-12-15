
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
let paddleMappers = [[4,3]]//[[6,8],[5,7]];

let a;
let b;

let modelsLoaded = 0;
let modelLoaded = false;
let handposeLoaded = false;
let posenetLoaded = false;

let screen = 1; //0: load, 1: game, 2: menu

let showFramerate = true;

let fingerTips = [4, 8, 12, 16, 20]

let triggers = [];
let trig = false;

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
  
  
  poseNet = ml5.poseNet(video, {flipHorizontal: true}, posenetReady2);
  //handpose = ml5.handpose(video, handposeReady);

 
  video.hide();
}

function posenetReady2() {
  modelLoaded = true;
  handposeLoaded = true;
  poseNet.on('pose', posenetCallback);
  //poseNet.on('pose', posenetCallback)
  //poseNet.off('pose', posenetCallback);
}

function posenetReady() {
  console.log("PoseNet ready");
  posenetLoaded = true;
  handpose = ml5.handpose(video, {flipHorizontal: true}, handposeReady);
  
}

function handposeReady() {
  console.log("HandPose ready");
  modelLoaded = true;
  handposeLoaded = true;
  screen = 2;
  handpose.on("predict", handposeCallback);
  //handpose.off("predict", handposeCallback);
  //poseNet.off('pose', posenetCallback);
  //handpose.
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
  paddles = [];
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

    for (p = 0; p < paddleMappers.length; p++) {
      pos1 = pose.keypoints[paddleMappers[p][0]].position
      pos2 = pose.keypoints[paddleMappers[p][1]].position
      paddles.push([pos1.x,pos1.y,pos2.x,pos2.y])

    }

  }

    
}

function drawHandposeKeypoints() {
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
      textSize(32);
      text(j.toString(), keypoint[0], keypoint[1])
      oldKeypoint = keypoint;
    }


    shape = fingerTips;
    fill(255,0,0)
    fingerTipPos = [];
    //beginShape();
    for (i = 0; i < shape.length; i++) {
      const keypoint = prediction.landmarks[shape[i]];
      //console.log(keypoint)
      if (keypoint) {
        //vertex(keypoint[0], keypoint[1]);
        fingerTipPos.push(keypoint);
      }
    }

    handWidth = distance(prediction.landmarks[5], prediction.landmarks[17]);

    avgx = 0;
    avgy = 0;
    //bias average to the thumb
    thumbWeight = 3;
    avgx += fingerTipPos[0][0]*thumbWeight;
    avgy += fingerTipPos[0][1]*thumbWeight;
    for (i = 0; i < fingerTipPos.length; i++) {
      avgx +=  fingerTipPos[i][0];
      avgy +=  fingerTipPos[i][1];
    }
    avgx = avgx/(fingerTipPos.length+thumbWeight)
    avgy = avgy/(fingerTipPos.length+thumbWeight)
    avg = [avgx, avgy];
    ellipse(avgx, avgy, 10, 10);

    handOpen = distance(avg, prediction.landmarks[4])/handWidth;
    if (handOpen <= 0.5) {
      if (!trig) {
        triggers.push(avg);
        trig = avg;
      }
    }
    else {
      trig = false; 
    }


    //endShape(CLOSE);
  }
}

function distance(pos1, pos2) {
  a = pos1;
  b = pos2;
  xDiff = b[0]-a[0];
  yDiff = b[1]-a[1];
  d = Math.sqrt(xDiff**2+yDiff**2)
  return d;

}

function processBall() {
  //update ball velocity
  ballVelM = (deltaTime/20)
  if (ballVelM >= 10) {
    ballVelM = 10;
  }
  //debug.innerHTML = ballVelM;
  ballX += ballXVel*ballVelM;
  ballY += ballYVel*ballVelM;

  //Bounds
  if (ballX < ballRad) { //left
    ballX -= ballXVel*ballVelM;
    ballXVel = -ballXVel;
  }
  if (ballX >= screenWidth-ballRad) { //right
    ballX -= ballXVel*ballVelM;
    ballXVel = -ballXVel;
  }
  if (ballY < ballRad) { //top
    ballY -= ballYVel*ballVelM;
    ballYVel = -ballYVel;
  }
  if (ballY >= screenHeight-ballRad) { //bottom
    ballY -= ballYVel*ballVelM;
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

      ballX -= ballXVel*ballVelM;
      ballY -= ballYVel*ballVelM;

      ballXVel = newXVel;
      ballYVel = newYVel;

      ballX += ballXVel*ballVelM;
      ballY += ballYVel*ballVelM;
      
      //console.log()

      
    }
  }

}

function draw() {
  if (screen == 1) {
    
    processBall();
  
    //console.log(xIntersect)
  
    background(0);
    //image(video, 0, 0, width, height);
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
  else if (screen == 2) {
    background(0);

    rect(screenWidth/4, screenHeight/2-20, screenWidth/2, 90);

    stroke(0);
    strokeWeight(10);
    fill(255);
    textSize(50);
    textAlign(CENTER);
    text("PLAY", screenWidth/2, screenHeight/2);

    drawHandposeKeypoints();

    debug.innerHTML = trig;
    console.log(trig);

    if (trig[1] >= screenHeight/2-40 && trig[1] <= screenHeight/2+100 && trig[0] >= screenWidth/4 && trig[0] <= screenWidth*3/4) {
      console.log(1);
      screen = 1;
      poseNet.on('pose', posenetCallback);
      handpose.off("predict", handposeCallback);
    }

    


    for (let j = 0; j < triggers.length; j += 1) {
      const keypoint = triggers[j];

      //stroke(0,255,0);
      //line(keypoint[0], keypoint[1], oldKeypoint[0], oldKeypoint[1]);      
      fill(0, 0, 255);
      noStroke();
      ellipse(keypoint[0], keypoint[1], 10, 10);
      textSize(32);
      text(j.toString(), keypoint[0], keypoint[1])
    }
    
  }
  else {
    background(0);
    fill(255)
    textSize(20);
    text('Model loading...', 0, 20);
    if (posenetLoaded)  {
      text('PoseNet Loaded', 0, 40);
    }
    if (handposeLoaded)  {
      text('HandPose Loaded', 0, 60);
    }

  }


  //Draw Framerate at top left
  if (showFramerate) {
    stroke(255);
    strokeWeight(1);
    fill(255);
    textSize(50);
    textAlign(LEFT,TOP);
    text(""+Math.round(frameRate()), 10, 20);
  }
}