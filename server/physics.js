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
    const vel = new vec2D.ObjectVector(ball.velocity.x, ball.velocity.y);


    const vec1 = new vec2D.ObjectVector(ball.x + ball.velocity.x, ball.y + ball.velocity.y);
    const a = checkLineCollide(x1, y1, x2, y2, ball.x, ball.y, vec1.getX(), vec1.getY());
    let vec2 = new vec2D.ObjectVector(x2, y2);
    vec2 = vec2.subtract(new vec2D.ObjectVector(a.x, a.y));
    vec1.subtract(new vec2D.ObjectVector(ball.x, ball.y));
    const angle = Math.acos((vec1.clone().dot(vec2)) / (vec1.magnitude() * (vec2.magnitude())));
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
    // paddle width is 51px so 25 px to left and right *on the line* is bounds of rect
    // starting center of p1(BC) is (400,700)
    // 375<x<425 y=700 ball pos +- 25 
    // startinc cneter of p2(CD) is (175,550)
    // left bound is x-12.5 y-12.5, right bound x+12.5 y+12.5  2.5 is offset for corner
    // starting center of p3(DE) is (175,250)
    // left bound is x-12.5 y+12.5, rightbound x+12.5, y-12.5
    // starting cetner of p4(EF) is (400,100)
    // 375<x<425 y=700; ball pos +-25
    // starting center of p5(FA) is (625,250)
    //left bound is x-12.5,y-12.5, right bound is x+12.5, y+12.5
    // starting center of p6(AB) is (625,550)
    // left bound is x+12.5, y-12.5, right bound x-12.5, y+12.5
  //paddle collision

  // BC both are just simple lines
  checkCollision(data, data.players[0].x +25, 695, data.players[0].x -25, 695);
  // EF
  checkCollision(data, data.players[3].x +25, 105, data.players[3].x -25, 105);
  // EF
  // v=(x1,y1)−(x0,y0). Normalize this to u=v||v||
  // distance*u + original point
  let u;
  let modifiedXY

  //v1 = (250,700)
  //v2 = (100,400)
  //v = (150,300)
  //u = v/335.41

  //CD
  u = {x:0.447, y:0.894};

  modifiedXY = {x:data.players[1].x, y: data.players[1].y};

  checkCollision(data, modifiedXY.x + u.x*25, modifiedXY.y + u.y*25, modifiedXY.x - u.x*25, modifiedXY.y - u.y*25);
  
  //FA
  modifiedXY = {x:data.players[4].x, y: data.players[4].y};
   
  checkCollision(data, modifiedXY.x + u.x*25, modifiedXY.y + u.y*25, modifiedXY.x - u.x*25, modifiedXY.y - u.y*25);
  
  //DE
  u = {x:0.447, y:-0.894};
  
  modifiedXY = {x:data.players[2].x, y: data.players[2].y};
  
  checkCollision(data, modifiedXY.x + u.x*25, modifiedXY.y + u.y*25, modifiedXY.x - u.x*25, modifiedXY.y - u.y*25);
  
  //AB

  modifiedXY = {x:data.players[5].x, y: data.players[5].y};
  
  checkCollision(data, modifiedXY.x + u.x*25, modifiedXY.y + u.y*25, modifiedXY.x - u.x*25, modifiedXY.y - u.y*25);
    
  //collsion with back wall zones that 
 
};
const update = (data) => {
       // update positions
  const updatedData = data;
  if(updatedData.ball.x <0 || updatedData.ball.x >800 || updatedData.ball.y <0 || updatedData.ball.y>800){
    updatedData.ball.x = 400;
    updatedData.ball.y = 400;
  }
  updatedData.ball.prevX = updatedData.ball.x;
  updatedData.ball.prevY = updatedData.ball.y;
  updatedData.ball.x += updatedData.ball.velocity.x;
  updatedData.ball.y += updatedData.ball.velocity.y;
  updatedData.ball.destX = updatedData.ball.x;
  updatedData.ball.destY = updatedData.ball.y;
  updatedData.ball.lerp = 0.05;
  
       // collision
  collision(updatedData);
};

module.exports.update = update;
