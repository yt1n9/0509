// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];

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
}

function draw() {
  image(video, 0, 0);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // Loop through keypoints and draw circles
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // Color-code based on left or right hand
          if (hand.handedness == "Left") {
            fill(255, 0, 255);
          } else {
            fill(255, 255, 0);
          }

          noStroke();
          circle(keypoint.x, keypoint.y, 16);
        }

        // Draw lines connecting keypoints in groups
        drawLines(hand, [0, 1, 2, 3, 4]);  // Thumb
        drawLines(hand, [5, 6, 7, 8]);    // Index finger
        drawLines(hand, [9, 10, 11, 12]); // Middle finger
        drawLines(hand, [13, 14, 15, 16]); // Ring finger
        drawLines(hand, [17, 18, 19, 20]); // Pinky finger
      }
    }
  }
}

// Function to draw lines connecting keypoints in a group
function drawLines(hand, indices) {
  for (let i = 0; i < indices.length - 1; i++) {
    let kp1 = hand.keypoints[indices[i]];
    let kp2 = hand.keypoints[indices[i + 1]];
    stroke(0, 255, 0); // Green lines
    strokeWeight(2);
    line(kp1.x, kp1.y, kp2.x, kp2.y);
  }
}
