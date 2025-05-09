// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleX, circleY; // 圓的初始位置
const circleRadius = 50; // 圓的半徑

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);

  // 初始化圓的位置在視窗中間
  circleX = width / 2;
  circleY = height / 2;
}

function draw() {
  image(video, 0, 0);

  // 繪製圓
  fill(0, 0, 255, 150); // 半透明藍色
  noStroke();
  circle(circleX, circleY, circleRadius * 2);

  // 確保至少檢測到一隻手
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // 繪製手部關鍵點
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // 根據左右手設定顏色
          if (hand.handedness == "Left") {
            fill(255, 0, 255);
          } else {
            fill(255, 255, 0);
          }

          noStroke();
          circle(keypoint.x, keypoint.y, 16);
        }

        // 繪製手指的連線
        drawLines(hand, [0, 1, 2, 3, 4]);  // 拇指
        drawLines(hand, [5, 6, 7, 8]);    // 食指
        drawLines(hand, [9, 10, 11, 12]); // 中指
        drawLines(hand, [13, 14, 15, 16]); // 無名指
        drawLines(hand, [17, 18, 19, 20]); // 小指

        // 檢查食指與大拇指是否同時碰觸圓
        let indexFinger = hand.keypoints[8]; // 食指的關鍵點
        let thumb = hand.keypoints[4]; // 大拇指的關鍵點
        let dIndex = dist(indexFinger.x, indexFinger.y, circleX, circleY);
        let dThumb = dist(thumb.x, thumb.y, circleX, circleY);

        if (dIndex < circleRadius && dThumb < circleRadius) {
          // 如果食指與大拇指同時碰觸圓，讓圓跟隨手指移動
          circleX = (indexFinger.x + thumb.x) / 2; // 圓心移動到兩指的中點
          circleY = (indexFinger.y + thumb.y) / 2;
        }
      }
    }
  }
}

// Function to draw lines connecting keypoints in a group
function drawLines(hand, indices) {
  for (let i = 0; i < indices.length - 1; i++) {
    let kp1 = hand.keypoints[indices[i]];
    let kp2 = hand.keypoints[indices[i + 1]];
    stroke(0, 255, 0); // 綠色線條
    strokeWeight(2);
    line(kp1.x, kp1.y, kp2.x, kp2.y);
  }
}
