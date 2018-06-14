function dist(v) {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
}

// constants
const ACCEL = 0.0001;
const FRICTION = 0.005;  // bigger means more friction
const MAX_SPEED = 100;

var front_left = document.getElementById("frontL");
var front_right = document.getElementById("frontR");
var back_left = document.getElementById("backL");
var back_right = document.getElementById("backR");

// this organizes the various character images.
// to use it, access char_image[who][color][facing][frame],
//   who is 0 or 1
//   color is "orange" or "purple"
//   facing is "left" or "right"
//    frame is 0 or 1
var char_image = [
  // char0
  {
    "front": {
      "left": [front_left],
      "right": [front_right],
    },
    "back": {
      "left": [back_left],
      "right": [back_right],
    }
  }
];


class Player {
  constructor(who, color, facing, keys, keyboard, world) {
    this.who = who;
    this.color = color;
    this.facing = facing;
    this.keys = keys;
    this.keyboard = keyboard;
    this.world = world;
    this.pos = [100, 100];
    this.vel = [0, 0];
    this.dest = null;
  }

  startAt(pos) {
    this.pos = pos.slice();
    this.start_pos = pos.slice();
  }
  
  whois() {
    return this.who;
  }
  
  decrease_speed(amount) {
    var speed = dist(this.vel);
    if (speed > amount) {
      var new_speed = (speed > MAX_SPEED) ? MAX_SPEED : (speed - amount);
      this.vel[0] *= (new_speed / speed);
      this.vel[1] *= (new_speed / speed);
    } else {
      this.vel[0] = 0;
      this.vel[1] = 0;
    }
  }
  
  update(deltaMs) {
    if (this.vanishing != null) {
      // can't move after vanishing
      return;
    }

    var a = [0, 0]
    // left
    if (this.keyboard[this.keys[0]] && !this.keyboard[this.keys[2]]) {
      a[0] -= ACCEL * deltaMs;
      this.facing = "left";
    }
    // up
    if (this.keyboard[this.keys[1]]) {
      a[1] -= ACCEL * deltaMs;
    }
    // right
    if (this.keyboard[this.keys[2]] && !this.keyboard[this.keys[0]]) {
      a[0] += ACCEL * deltaMs;
      this.facing = "right";
    }
    // down
    if (this.keyboard[this.keys[3]]) {
      a[1] += ACCEL * deltaMs;
    }
    this.vel[0] += a[0] * deltaMs;
    this.vel[1] += a[1] * deltaMs;
    this.decrease_speed(FRICTION);
    this.pos[0] = parseInt(this.pos[0] + this.vel[0] * deltaMs);
    this.pos[1] = parseInt(this.pos[1] + this.vel[1] * deltaMs);
    if (this.pos[0] < 0) {
      this.pos[0] = 0;
      this.vel[0] = 0;
    } else if (this.pos[0] > this.world.width) {
      this.pos[0] = this.world.width - 1;
      this.vel[0] = 0;
    }
    if (this.pos[1] < 0) {
      this.pos[1] = 0;
      this.vel[1] = 0;
    } else if (this.pos[1] > this.world.height) {
      this.pos[1] = this.world.height - 1;
      this.vel[1] = 0;
    }
  }
                          
  draw(absoluteMs, ctx) {
      // wobble up and down something like once per second
      var dy = Math.sin(absoluteMs * 0.002) * 4;
      // wobble left and right something like once every other second
      var dx = Math.cos(absoluteMs * 0.001) * 2;

      var frame = Math.floor(absoluteMs * 0.001) % 2;
      var image = back_left;
      var x = this.pos[0] + dx;
      var y = this.pos[1] + dy;
    
      ctx.globalCompositeOperation = 'overlay';
      ctx.fillStyle = this.color;
      ctx.fillRect(x, y, image.width, image.height);
      ctx.drawImage(image, x - image.width / 2, y - image.height / 2);
  }
}
