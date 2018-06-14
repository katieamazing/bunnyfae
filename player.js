
class Player {
  constructor(who, color, facing, keys, keyboard, world) {
    this.who = who;
    this.color = color;
    this.facing = facing;
    this.keys = keys;
    this.keyboard = keyboard;
    this.world = world;
    this.pos = [0, 0];
    this.vel = [0, 0];
    this.holding = null;
    // a player is "picking" if they were not holding anything when they started pressing action
    this.picking = false;
    // a player is "putting" if they were holding something when they started pressing action
    this.putting = false;
    this.vanishing = null;
    this.dest = null;
  }

  startAt(pos) {
    this.pos = pos.slice();
    this.start_pos = pos.slice();
  }

  teleportHome() {
    teleport(this, this.start_pos);
  }
  
  whois() {
    return this.who;
  }
  
  vanish() {
    this.vanishing = performance.now();
  }

  actionButtonDown() {
    return this.keyboard[this.keys[4]];
  }

  handPos() {
    if (this.facing == "left") {
      return [this.pos[0] - 30, this.pos[1]];
    } else {
      return [this.pos[0] + 30, this.pos[1]];
    }
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
    
    if (this.actionButtonDown() && !this.picking && !this.putting) {
      if (this.holding == null) {
        this.picking = true;
      } else {
        this.putting = true;
      }
    }
    if (this.putting && this.holding !== null) {
      // console.log("dropped: ", this.holding);
      this.holding = null;
    }
    if (!this.actionButtonDown()) {
      this.picking = false;
      this.putting = false;
    }
  }
                          
  draw(absoluteMs, ctx) {
      // wobble up and down something like once per second
      var dy = Math.sin(absoluteMs * 0.002) * 4;
      // wobble left and right something like once every other second
      var dx = Math.cos(absoluteMs * 0.001) * 2;

      var frame = Math.floor(absoluteMs * 0.001) % 2;
      var image = char_image[this.who][this.color][this.facing][frame]
      var x = this.pos[0] + dx;
      var y = this.pos[1] + dy;
      ctx.fillStyle = this.color;
      ctx.drawImage(image, x - image.width / 2, y - image.height / 2);
  }
}
