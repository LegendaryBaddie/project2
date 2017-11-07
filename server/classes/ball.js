class Ball {
  constructor(startPos) {
    this.x = startPos;
    this.y = startPos;
    this.prevX = startPos;
    this.prevY = startPos;
    this.destX = startPos;
    this.destY = startPos;
    this.velocity = {
      x: (Math.round(Math.random()) * 2 - 1)*3,
      y: (Math.round(Math.random()) * 2 - 1)*3,
    };
    this.lerp = 0;
    this.radius = 5;
  }
}
module.exports = Ball;
