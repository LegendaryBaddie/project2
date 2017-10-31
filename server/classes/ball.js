class Ball {
  constructor(startPos) {
    this.x = startPos;
    this.y = startPos;
    this.prevX = startPos;
    this.prevY = startPos;
    this.destX = startPos;
    this.destY = startPos;
    this.velocity = {
      x: 3,
      y: 5,
    };
    this.lerp = 0;
    this.radius = 5;
  }
}
module.exports = Ball;
