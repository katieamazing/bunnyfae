/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// prints "hi" in the browser's dev tools console
console.log('hi');

var canvas = document.getElementById("thecanvas");
var ctx = canvas.getContext("2d", { alpha: false });
const SCREEN_WIDTH = canvas.width;
const SCREEN_HEIGHT = canvas.height;
const LONG_PRESS_DURATION = 150;  // milliseconds
const BOX100 = document.getElementById("box100");

// magic numbers for keys
const QSDR_SPACE = [81, 83, 68, 82, 32];
const WASD_SPACE = [87, 65, 83, 68, 32];

function update(deltaMs) {
  //nothing yet
  player.update(deltaMs)
}

function draw_glyph_node(ctx,) {
  ctx.beginPath();
  ctx.arc(300, 100, 59/2, 0, 2*Math.PI);
  ctx.stroke();
}

function draw(absoluteMs, ctx) {
  ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  ctx.beginPath();
  ctx.rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  ctx.fillStyle = "gray";
  ctx.fill();
  
  ctx.drawImage(BOX100, 100, 100); 
  
  ctx.save();
  ctx.scale(Math.sqrt(1.5), Math.sqrt(0.5));
  ctx.beginPath();
  ctx.arc(300, 300, 6*(59/2), 0, 2*Math.PI);
  ctx.stroke();
  
  draw_glyph_node(ctx);
  ctx.restore();
  
  player.draw(absoluteMs, ctx);
}

class Keyboard {
  constructor () {
    var that = this;
    document.body.addEventListener("keydown", function (e) { that.keydown(e); });
    document.body.addEventListener("keyup", function (e) { that.keyup(e); });
  }
  
  keydown(e) {
    if (e.keyCode == 87
      || e.keyCode == 65
      || e.keyCode == 83
      || e.keyCode == 68
      || e.keyCode == 32) {
      e.preventDefault();
      // by keeping track of when the key was down,
      // we can distinguish recent-down from long-down
      if (this[e.keyCode] == null) {
        this[e.keyCode] = performance.now();
      }
    }
  }

  keyup(e) {
      this[e.keyCode] = null;
  }
  
  long_press(keyCode) {
    // was the key pressed at least LONG_PRESS_DURATION ms ago?
    var answer = this[keyCode] && this[keyCode] < performance.now() - LONG_PRESS_DURATION;
    if (answer) {
      // if we are returning true, then don't return true again next frame,
      // instead only return true LONG_PRESS_DURATION more ms from now.
      this[keyCode] = performance.now();
    }
    return answer;
  }
}


var keyboard = new Keyboard();
var player = new Player("foofoo", "#ffacb7", "down", keyboard, null);


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