/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// prints "hi" in the browser's dev tools console
console.log('hi');

var canvas = document.getElementById("thecanvas");
var ctx = canvas.getContext("2d", { alpha: false });
const SCREEN_WIDTH = canvas.width;
const SCREEN_HEIGHT = canvas.height;

function draw(absoluteMs, ctx) {
  ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  ctx.beginPath();
  ctx.rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  ctx.fillStyle = "gray";
  ctx.fill();
}

var previousFrameMs = null;
function tick(absoluteMs) {
  if (previousFrameMs === null) {
    previousFrameMs = absoluteMs;
  }
  var deltaMs = absoluteMs - previousFrameMs;
  // console.log(deltaMs);
  if (deltaMs > 100) {
    deltaMs = 100;
  }
  previousFrameMs = absoluteMs;
  update(deltaMs);
  draw(absoluteMs, ctx);
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);