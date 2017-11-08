// big thanks to http://ericleong.me/research/circle-line/
// for the circle line collision stuff
const Message = require('./classes/Message.js');
const collide = require('line-circle-collision');
const vec2D = require('vector2d');
const Ball = require('./classes/ball.js');

let room = {};
let canStart = false;

const resetBall = () => {
  room.ball = new Ball(400, room.ball.speed + 1);
};
const checkCollision = (x1, y1, x2, y2) => {
  const ball = room.ball;
  const one = [x1, y1];
  const two = [x2, y2];
  const circle = [ball.x, ball.y];
  const nearest = [0, 0];
  if (collide(one, two, circle, ball.radius, nearest)) {
        // reflect
        // horizontal wall
    if (y1 === y2) {
      room.ball.velocity.y *= -1;
      return;
    }

    const v1 = new vec2D.ObjectVector(ball.velocity.x, ball.velocity.y);

    const normal = new vec2D.ObjectVector(y2 - y1, -1 * (x2 - x1));
    normal.normalize();


    const step1 = v1.clone().dot(normal.clone()) * 2;

    const outV = v1.clone().subtract(normal.clone().mulS(step1));

    /*
    const vel = new vec2D.ObjectVector(ball.velocity.x, ball.velocity.y);


    const vec1 = new vec2D.ObjectVector(ball.x + ball.velocity.x, ball.y + ball.velocity.y);
    const a = checkLineCollide(x1, y1, x2, y2, ball.x, ball.y, vec1.getX(), vec1.getY());
    let vec2 = new vec2D.ObjectVector(x2, y2);
    vec2 = vec2.subtract(new vec2D.ObjectVector(a.x, a.y));
    vec1.subtract(new vec2D.ObjectVector(ball.x, ball.y));
    const angle = Math.acos((vec1.clone().dot(vec2)) / (vec1.magnitude() * (vec2.magnitude())));
    vel.rotate(2 * angle);
    */

    room.ball.velocity.x = outV.getX();
    room.ball.velocity.y = outV.getY();
  }
};
const checkBackWall = () => {
   // hexagon of radius 350
    // centered at 0,0 has points at
    //
    //     (225,50)E ______ F (575,50)
    //              /      \
    //  (50,400) D /        \ A (750,400)
    //             \        /
    //   (225,750)C \______/ B (575,750)
  let one;
  let two;
  const circle = [room.ball.x, room.ball.y];

  // ab
  if (room.ball.x > 550 && room.ball.y > 400) {
    one = [750, 400];
    two = [575, 750];
    if (collide(one, two, circle, room.ball.radius)) {
      // kill player 5
      room.players[5].alive = false;
      process.send(new Message('death', room.players[5]));
      resetBall();
    }
  }
  // bc
  if (room.ball.y > 700) {
    one = [575, 750];
    two = [225, 750];
    if (collide(one, two, circle, room.ball.radius)) {
      // kill player 0
      room.players[0].alive = false;
      process.send(new Message('death', room.players[0]));
      resetBall();
    }
  }
  // cd
  if (room.ball.x < 250 && room.ball.y > 400) {
    one = [225, 750];
    two = [50, 400];
    if (collide(one, two, circle, room.ball.radius)) {
      // kill player 1
      room.players[1].alive = false;
      process.send(new Message('death', room.players[1]));
      resetBall();
    }
  }
  // DE
  if (room.ball.x < 250 && room.ball.y < 400) {
    one = [50, 400];
    two = [225, 50];
    if (collide(one, two, circle, room.ball.radius)) {
      // kill player 2
      room.players[2].alive = false;
      process.send(new Message('death', room.players[2]));
      resetBall();
    }
  }
  // EF
  if (room.ball.y < 100 && room.ball.x < 575) {
    one = [225, 50];
    two = [575, 50];
    if (collide(one, two, circle, room.ball.radius)) {
      // kill player 3
      room.players[3].alive = false;
      process.send(new Message('death', room.players[3]));
      resetBall();
    }
  }
  // FA
  if (room.ball.x > 550 && room.ball.y < 400) {
    one = [575, 50];
    two = [750, 400];
    if (collide(one, two, circle, room.ball.radius)) {
      // kill player 4
      room.players[4].alive = false;
      process.send(new Message('death', room.players[4]));
      resetBall();
    }
  }
};
const collision = () => {
    // room should be a single room obj
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
    // left bound is x-12.5,y-12.5, right bound is x+12.5, y+12.5
    // starting center of p6(AB) is (625,550)
    // left bound is x+12.5, y-12.5, right bound x-12.5, y+12.5
  // paddle collision

  // BC both are just simple lines
  if (room.players[0].alive) {
    checkCollision(room.players[0].x + 25, 695, room.players[0].x - 25, 695);
  } else {
    checkCollision(550, 700, 250, 700);
  }
  // EF
  if (room.players[3].alive) {
  // console.dir(room.players[3].x);
    checkCollision(room.players[3].x + 25, 105, room.players[3].x - 25, 105);
  } else {
    checkCollision(250, 100, 550, 100);
  }
  // EF
  // v=(x1,y1)−(x0,y0). Normalize this to u=v||v||
  // distance*u + original point
  let u;
  let modifiedXY;

  // v1 = (250,700)
  // v2 = (100,400)
  // v = (150,300)
  // u = v/335.41

  // CD
  u = { x: 0.447, y: 0.894 };
  if (room.players[1].alive) {
    // if player is alive use their paddle
    modifiedXY = { x: room.players[1].x, y: room.players[1].y };
    checkCollision(modifiedXY.x + u.x * 25,
                   modifiedXY.y + u.y * 25,
                   modifiedXY.x - u.x * 25,
                   modifiedXY.y - u.y * 25);
  } else {
    // otherwise use the line their paddle is on
    checkCollision(250, 700, 100, 400);
  }

  // FA
  if (room.players[4].alive) {
    modifiedXY = { x: room.players[4].x, y: room.players[4].y };
    checkCollision(modifiedXY.x + u.x * 25,
                   modifiedXY.y + u.y * 25,
                   modifiedXY.x - u.x * 25,
                   modifiedXY.y - u.y * 25);
  } else {
    checkCollision(550, 100, 700, 400);
  }
  // DE
  u = { x: 0.447, y: -0.894 };
  if (room.players[2].alive) {
    modifiedXY = { x: room.players[2].x, y: room.players[2].y };
    checkCollision(modifiedXY.x + u.x * 25,
                   modifiedXY.y + u.y * 25,
                   modifiedXY.x - u.x * 25,
                   modifiedXY.y - u.y * 25);
  } else {
    checkCollision(100, 400, 250, 100);
  }
  // AB
  if (room.players[5].alive) {
    modifiedXY = { x: room.players[5].x, y: room.players[5].y };
    checkCollision(modifiedXY.x + u.x * 25,
                   modifiedXY.y + u.y * 25,
                   modifiedXY.x - u.x * 25,
                   modifiedXY.y - u.y * 25);
  } else {
    checkCollision(700, 400, 550, 700);
  }
  // collsion with back wall zones that
  // check for collision on bottom right so AB and BC
  checkBackWall();
  room.ball.lerp = 0.05;
  process.send(new Message('ball', room));
};
const update = () => {
       // update positions


  room.ball.prevX = room.ball.x;
  room.ball.prevY = room.ball.y;
  room.ball.x += room.ball.velocity.x * room.ball.speed;
  room.ball.y += room.ball.velocity.y * room.ball.speed;
  room.ball.destX = room.ball.x;
  room.ball.destY = room.ball.y;
  room.ball.lerp = 0.05;

       // collision
  collision();
};


setInterval(() => {
  if (canStart) {
    update();
  }
}, 30);

process.on('message', (messageObject) => {
  switch (messageObject.type) {
    case 'room' : {
      room = messageObject.data;
      canStart = true;
      break;
    }
    case 'paddle' : {
      room.players[messageObject.data.player] = messageObject.data;
      break;
    }
    default: {
      console.log('Type not recognized');
    }
  }
});
