// big thanks to http://ericleong.me/research/circle-line/
// for the circle line collision stuff
const sockets = require('./sockets.js');
const collide = require('line-circle-collision');
const vec2D = require('vector2d');

const checkLineCollide = (x1, y1, x2, y2, x3, y3, x4, y4) => {
  const A1 = y2 - y1;
  const B1 = x1 - x2;
  const C1 = A1 * x1 + B1 * y1;
  const A2 = y4 - y3;
  const B2 = x3 - x4;
  const C2 = A2 * x3 + B2 * y3;
  const det = A1 * B2 - A2 * B1;
  if (det !== 0) {
    const x = (B2 * C1 - B1 * C2) / det;
    const y = (A1 * C2 - A2 * C1) / det;
    return { x, y };
  }
  return null;
};

const checkCollision = (data, x1, y1, x2, y2) => {
  const ball = data.ball;
  const newData = data;
  const one = [x1, y1];
  const two = [x2, y2];
  const circle = [ball.x, ball.y];
  if (collide(one, two, circle, ball.radius)) {
        // reflect
    const vel = vec2D.ObjectVector(ball.velocity.x, ball.velocity.y);


    const vec1 = vec2D.ObjectVector(ball.x + ball.velocity.x, ball.y + ball.velocity.y);
    const a = checkLineCollide(x1, y1, x2, y2, ball.x, ball.y, vec1.getX(), vec1.getY());
    let vec2 = vec2D.ObjectVector(x2, y2);
    vec2 = vec2.subtract(vec2D.ObjectVector(a.x, a.y));
    vec1.subtract(vec2D.ObjectVector(ball.x, ball.y));
    const angle = Math.acos((vec1.clone().dot(vec2)) / (vec1.magnitude() * (vec2.magnitude())));
    console.dir(vec1);
    console.dir(angle);
    vel.rotate(2 * angle);
    newData.ball.velocity.x = vel.x;
    newData.ball.velocity.y = vel.y;
  }
  sockets.setRoom(newData);
};
const collision = (data) => {
    // data should be a single room obj
    // check and respond if the ball is colliding with walls
    // hexagon of radius 300
    // centered at 0,0 has points at
    //
    //    (250,100)E ______ F (550,100)
    //              /      \
    // (100,400) D /        \ A (700,400)
    //             \        /
    //   (250,700)C \______/ B (550,700)
    // prototype will just have a ball syncing bouncing around 6 walls
    // will eventually get rid of walls just have paddles and the this will eventually change
    // the line segments start and end
   // AB
  checkCollision(data, 700, 400, 550, 700);
   // BC
  checkCollision(data, 550, 700, 250, 700);
   // CD
  checkCollision(data, 250, 700, 100, 400);
   // DE
  checkCollision(data, 100, 400, 250, 100);
   // EF
  checkCollision(data, 250, 100, 550, 100);
   // FA
  checkCollision(data, 550, 100, 700, 400);
};
const update = (data) => {
       // update positions
  const updatedData = data;
  updatedData.ball.prevX = updatedData.ball.x;
  updatedData.ball.prevY = updatedData.ball.y;
  updatedData.ball.x += updatedData.ball.velocity.x;
  updatedData.ball.y += updatedData.ball.velocity.y;
  updatedData.ball.destX = updatedData.ball.x;
  updatedData.ball.destY = updatedData.ball.y;

       // collision
  collision(updatedData);
};

module.exports.update = update;
