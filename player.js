function dist(v) {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
}

// constants
const ACCEL = 0.0001;
const FRICTION = 0.009;  // bigger means more friction
const MAX_SPEED = 50;

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
  constructor(who, color, facing, keyboard, world) {
    this.who = who;
    this.color = color;
    this.facing = facing;
    this.keyboard = keyboard;
    this.world = world;
    this.pos = [100, 100];
    this.vel = [0, 0];
    this.dest = null;
    this.sprite = back_left;
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
  
  upIsPressed() {
    return this.keyboard[87]; // W
  }
  
  downIsPressed() {
    return this.keyboard[83]; // S
  }
  
  update(deltaMs) {
    if (this.vanishing != null) {
      // can't move after vanishing
      return;
    }

    // changes of facing
    if (this.upIsPressed()) {
      this.facing = "up";
    }
    if (this.downIsPressed()) {
      this.facing = "down";
    }
    
    
    var a = [0, 0]
    // up and left
    if (this.keyboard[65] && this.facing == "up") {
      a[0] -= ACCEL * deltaMs;
      a[1] -= ACCEL * deltaMs; // TODO: not actually a square
      this.sprite = back_left;
    }
    // up and right
    if (this.keyboard[68] && this.facing == "up") {
      a[0] += ACCEL * deltaMs;
      a[1] -= ACCEL * deltaMs; // TODO: not actually a square
      this.sprite = back_right;
    }
    // down and left
    if (this.keyboard[65] && this.facing == "down") {
      a[0] -= ACCEL * deltaMs;
      a[1] += ACCEL * deltaMs; // TODO: not actually a square
      this.sprite = front_left;
    }
    // down and right
    if (this.keyboard[68] && this.facing == "down") {
      a[0] += ACCEL * deltaMs;
      a[1] += ACCEL * deltaMs; // TODO: not actually a square
      this.sprite = front_right;
    }
    this.vel[0] += a[0] * deltaMs;
    this.vel[1] += a[1] * deltaMs;
    this.decrease_speed(FRICTION);
    this.pos[0] = parseInt(this.pos[0] + this.vel[0] * deltaMs);
    this.pos[1] = parseInt(this.pos[1] + this.vel[1] * deltaMs);
    /*
    TODO: clamp the position to within the world
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
    */
  }
                          
  draw(absoluteMs, ctx) {
      // wobble up and down something like once per second
      var dy = Math.sin(absoluteMs * 0.002) * 4;
      // wobble left and right something like once every other second
      var dx = Math.cos(absoluteMs * 0.001) * 2;

      var frame = Math.floor(absoluteMs * 0.001) % 2;
      var x = this.pos[0] + dx;
      var y = this.pos[1] + dy;
    
      ctx.globalCompositeOperation = 'overlay';
      //ctx.globalCompositeOperation = 'source-in';
      ctx.fillStyle = this.color;
      ctx.fillRect(x, y, this.sprite.width, this.sprite.height);
      ctx.drawImage(this.sprite, x - this.sprite.width / 2, y - this.sprite.height / 2);
  }
}
