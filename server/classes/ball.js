class Ball {
  constructor(startPos, speed) {
    this.x = startPos;
    this.y = startPos;
    this.prevX = startPos;
    this.prevY = startPos;
    this.destX = startPos;
    this.destY = startPos;
    this.velocity = {
      x: (Math.round(Math.random()) * 2 - 1),
      y: (Math.round(Math.random()) * 2 - 1),
    };
    this.speed = speed;
    this.lerp = 0;
    this.radius = 5;
  }
}
module.exports = Ball;
