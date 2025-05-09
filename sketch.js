// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleX, circleY; // 圓的初始位置
const circleRadius = 50; // 圓的半徑
let isDragging = false; // 是否正在拖動圓
let previousX, previousY; // 儲存圓心的前一個位置

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
  previousX = circleX;
  previousY = circleY;
}

function draw() {
  image(video, 0, 0);

  // 如果正在拖動圓，繪製軌跡
  if (isDragging) {
    stroke(255, 0, 0); // 紅色線條
    strokeWeight(2);
    line(previousX, previousY, circleX, circleY);
    previousX = circleX;
    previousY = circleY;
  }

  // 繪製圓
  fill(0, 0, 255, 150); // 半透明藍色
  noStroke();
  circle(circleX, circleY, circleRadius * 2);

  // 確保至少檢測到一隻手
  if (hands.length > 0) {
    let dragging = false; // 用於檢查是否有手指正在拖動圓
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // 繪製手指的連線
        drawLines(hand, [0, 1, 2, 3, 4]);  // 拇指
        drawLines(hand, [5, 6, 7, 8]);    // 食指
        drawLines(hand, [9, 10, 11, 12]); // 中指
        drawLines(hand, [13, 14, 15, 16]); // 無名指
        drawLines(hand, [17, 18, 19, 20]); // 小指

        // 檢查食指與大拇指是否同時碰觸圓
        let indexFinger = hand.keypoints[8]; // 食指的關鍵點
        let thumb = hand.keypoints[4]; // 大拇指的關鍵點

        // 將座標轉換為畫布的座標
        let indexX = indexFinger.x * width / video.width;
        let indexY = indexFinger.y * height / video.height;
        let thumbX = thumb.x * width / video.width;
        let thumbY = thumb.y * height / video.height;

        let dIndex = dist(indexX, indexY, circleX, circleY);
        let dThumb = dist(thumbX, thumbY, circleX, circleY);

        if (dIndex < circleRadius && dThumb < circleRadius) {
          // 如果食指與大拇指同時碰觸圓，讓圓跟隨手指移動
          circleX = (indexX + thumbX) / 2; // 圓心移動到兩指的中點
          circleY = (indexY + thumbY) / 2;
          dragging = true; // 設定為正在拖動
        }
      }
    }
    isDragging = dragging; // 更新拖動狀態
  } else {
    isDragging = false; // 如果沒有手，停止拖動
  }
}

// Function to draw lines connecting keypoints in a group
function drawLines(hand, indices) {
  for (let i = 0; i < indices.length - 1; i++) {
    let kp1 = hand.keypoints[indices[i]];
    let kp2 = hand.keypoints[indices[i + 1]];

    // 將座標轉換為畫布的座標
    let kp1X = kp1.x * width / video.width;
    let kp1Y = kp1.y * height / video.height;
    let kp2X = kp2.x * width / video.width;
    let kp2Y = kp2.y * height / video.height;

    // 繪製連線
    stroke(0, 255, 0); // 綠色線條
    strokeWeight(2);
    line(kp1X, kp1Y, kp2X, kp2Y);
  }
}
