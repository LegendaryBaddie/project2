class Paddle {
  constructor(hash, player,x,y) {
    this.hash = hash;
    this.lastUpdate = new Date().getTime();
    this.x = x;
    this.y = y;
    this.prevX = x;
    this.prevY = y;
    this.destX = x;
    this.destY = y;
    this.lerp = 0;
    this.moveLeft = false;
    this.moveRight = false;
    this.player = player;
    this.alive = true;
  }
}

module.exports = Paddle;
