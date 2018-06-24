function dist(v) {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
}

// constants
const ACCEL = 0.00005;
const FRICTION = 0.007;  // bigger means more friction
const MAX_SPEED = 5;

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


export default class Player {
  constructor(who, color, facing, keyboard, world) {
    this.who = who;
    this.color = color;
    this.facing = facing;
    this.keyboard = keyboard;
    this.world = world;
    this.x = 0;
    this.y = 0;
    this.w = 61;
    this.h = 64;
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
  
  rects_collide(obstacle){
    if (this.x + this.w >= obstacle.x&&     // r1 right edge past r2 left
      this.x <= obstacle.x + obstacle.w &&       // r1 left edge past r2 right
      this.y + this.h >= obstacle.y &&       // r1 top edge past r2 bottom
      this.y <= obstacle.y+ obstacle.h) {       // r1 bottom edge past r2 top
        return true;
    }
    return false;
  }

  nudge_away(obstacle){
  }

  snap_to(glyph_node){
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

  leftIsPressed() {
    return this.keyboard[65]; // A
  }
  
  rightIsPressed() {
    return this.keyboard[68]; // D
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
    if (this.leftIsPressed()) {
      this.left_right_facing = "left";
    }
    if (this.rightIsPressed()) {
      this.left_right_facing = "right";
    }
    if (this.facing == "up" && this.left_right_facing == "left") {
      this.sprite = back_left;
    }
    if (this.facing == "up" && this.left_right_facing == "right") {
      this.sprite = back_right;
    }
    if (this.facing == "down" && this.left_right_facing == "left") {
      this.sprite = front_left;
    }
    if (this.facing == "down" && this.left_right_facing == "right") {
      this.sprite = front_right;
    }

    // acceleration
    var a = [0, 0]
    if (this.upIsPressed()) {  // up
      a[1] -= ACCEL * deltaMs;
    }
    if (this.downIsPressed()) {  // up
      a[1] += ACCEL * deltaMs;
    }
    if (this.leftIsPressed()) {  // left
      a[0] -= ACCEL * deltaMs;
    }
    if (this.rightIsPressed()) {  // right
      a[0] += ACCEL * deltaMs;
    }
    
    // velocity 
    this.vel[0] += a[0] * deltaMs;
    this.vel[1] += a[1] * deltaMs;
    this.decrease_speed(FRICTION);
    
    // position
    this.x = parseInt(this.x + this.vel[0] * deltaMs);
    this.y = parseInt(this.y + this.vel[1] * deltaMs);
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
  render_position(world_x, world_y) {
    let screen_x = world_x;
    let screen_y = world_y * Math.sin(Math.PI / 6) / Math.sin(Math.PI / 4)
    return [screen_x, screen_y];
  }
  
  render_squish_rect(rect){
    let squished_pos = this.render_position(rect.x, rect.y);
    let squished_height = rect.h * Math.sin(Math.PI / 6) / Math.sin(Math.PI / 4);
    return {x: squished_pos[0], y: squished_pos[1], w: rect.w, h: squished_height};
  }
  
  
  draw(absoluteMs, ctx) {
    // wobble up and down something like once per second
    var dy = Math.sin(absoluteMs * 0.002) * 4;
    // wobble left and right something like once every other second
    var dx = Math.cos(absoluteMs * 0.001) * 2;

    var frame = Math.floor(absoluteMs * 0.001) % 2;
    var screen_x;
    var screen_y;
    [screen_x, screen_y] = this.render_position(this.x + dx, this.y + dy);

    ctx.fillStyle = "purple";
    let purple_pos = this.render_position([500, 300]);
    let purple_rect = {x:500, y:300, w:200, h:200};
    let squished_rect = this.render_squish_rect(purple_rect);
    ctx.fillRect(squished_rect.x, squished_rect.y, squished_rect.w, squished_rect.h);
    ctx.globalCompositeOperation = 'overlay';
    //ctx.globalCompositeOperation = 'source-in';
    if (this.rects_collide(purple_rect)) {
      ctx.fillStyle = "blue";
    } else {
      ctx.fillStyle = this.color;
    }
    ctx.fillRect(screen_x, screen_y, this.sprite.width, this.sprite.height);
    ctx.drawImage(this.sprite, screen_x - this.sprite.width / 2, screen_y - this.sprite.height / 2);
  }
}
