// big thanks to http://ericleong.me/research/circle-line/
// for the circle line collision stuff
const Message = require('./classes/Message.js');
const collide = require('line-circle-collision');
const vec2D = require('vector2d');
const Ball = require('./classes/ball.js');

let room = {};
let canStart = false;

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
const resetBall = () =>{
  room.ball = new Ball(400);
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
    //move ball in towards center so it doesn't break through things
    //top right quadrant
    if(newData.ball.x>550 && newData.ball.y<400){
        newData.ball.x -= 3;
        newData.ball.y += 3;
     }
     //bottom right
    if(newData.ball.x>550 && newData.ball.y>400){
      newData.ball.x -= 3;
      newData.ball.y -= 3;
    }
    //bottom left
    if(newData.ball.x<250 && newData.ball.y>400){
      newData.ball.x += 3;
      newData.ball.y -= 3;
    }
    //top left
    if(newData.ball.x<250 && newData.ball.y<400){
      newData.ball.x += 3;
      newData.ball.y += 3;
    }
    
  }
  room = newData;
};
const checkBackWall = (data) => {

   // hexagon of radius 350
    // centered at 0,0 has points at
    //
    //     (225,50)E ______ F (575,50)
    //              /      \
    //  (50,400) D /        \ A (750,400)
    //             \        /
    //   (225,750)C \______/ B (575,750)
  let one,two;
  let circle = [data.ball.x,data.ball.y]
 
  //ab
  if(data.ball.x>550 && data.ball.y>400)
  {
    one = [750,400];
    two = [575,750];
    if (collide(one, two, circle, data.ball.radius))
    {
      //kill player 5
      room.players[5].alive = false;
      console.log("player 5 died");
      process.send(new Message('death', room.players[5]));
      resetBall();
    }
  }
  //bc
  if(data.ball.y>700)
  {
    one = [575,750];
    two = [225,750];
    if (collide(one, two, circle, data.ball.radius))
    {
      //kill player 0
      room.players[0].alive = false;
      console.log("player 0 died");
      process.send(new Message('death', room.players[0]));
      resetBall();
    }
  }
  //cd
  if(data.ball.x<250 && data.ball.y>400 )
  {
    one = [225,750];
    two = [50,400];
    if (collide(one, two, circle, data.ball.radius))
    {
      //kill player 1
      room.players[1].alive = false;
      console.log("player 1 died");
      process.send(new Message('death', room.players[1]));
      resetBall();
    }
  }
  //DE
  if(data.ball.x<250 && data.ball.y<400)
  {
    one = [50,400];
    two = [225,50];
    if (collide(one, two, circle, data.ball.radius))
    {
      //kill player 2
      room.players[2].alive = false;
      console.log("player 2 died");
      process.send(new Message('death', room.players[2]));
      resetBall();
    }
  }
  //EF
  if(data.ball.y<100 && data.ball.x<575){
    one = [225,50];
    two = [575,50];
    if (collide(one, two, circle, data.ball.radius))
    {
      //kill player 3
      room.players[3].alive = false;
      console.log("player 3 died");
      process.send(new Message('death', room.players[3]));
      resetBall();
    }
  }
  //FA
  if(data.ball.x>550 && data.ball.y <400){
    one = [575,50];
    two = [750,400];
    if (collide(one, two, circle, data.ball.radius))
    {
      //kill player 4
      room.players[4].alive = false;
      console.log("player 4 died");
      process.send(new Message('death', room.players[4]));
      resetBall();
    }
  }
}
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
  if(room.players[0].alive){
  checkCollision(data, data.players[0].x +25, 695, data.players[0].x -25, 695);
  }else{
  checkCollision(data, 550,700,250,700);
  }
  // EF
  if(room.players[3].alive){
  checkCollision(data, data.players[3].x +25, 105, data.players[3].x -25, 105);
  }else{
  checkCollision(data, 250,100,550,100);
  }
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
  if(room.players[1].alive){
    //if player is alive use their paddle 
  modifiedXY = {x:data.players[1].x, y: data.players[1].y};
  checkCollision(data, modifiedXY.x + u.x*25, modifiedXY.y + u.y*25, modifiedXY.x - u.x*25, modifiedXY.y - u.y*25);
  }else{
    //otherwise use the line their paddle is on
  checkCollision(data, 250,700,100,400)
  }
  
  //FA
  if(room.players[4].alive){
  modifiedXY = {x:data.players[4].x, y: data.players[4].y}; 
  checkCollision(data, modifiedXY.x + u.x*25, modifiedXY.y + u.y*25, modifiedXY.x - u.x*25, modifiedXY.y - u.y*25);
  }else{
  checkCollision(data, 550,100,700,400);
  }
  //DE
  u = {x:0.447, y:-0.894};
  if(room.players[2].alive){
  modifiedXY = {x:data.players[2].x, y: data.players[2].y};
  checkCollision(data, modifiedXY.x + u.x*25, modifiedXY.y + u.y*25, modifiedXY.x - u.x*25, modifiedXY.y - u.y*25);
  }else{
  checkCollision(data,100,400,250,100);
  }
  //AB
  if(room.players[5].alive){
  modifiedXY = {x:data.players[5].x, y: data.players[5].y}; 
  checkCollision(data, modifiedXY.x + u.x*25, modifiedXY.y + u.y*25, modifiedXY.x - u.x*25, modifiedXY.y - u.y*25);
  }else{
  checkCollision(data,700,400,550,700);
  }
  //collsion with back wall zones that 
  // check for collision on bottom right so AB and BC
  checkBackWall(data);
  process.send(new Message('ball', room));
};
const update = () => {
       // update positions
  const updatedData = room;

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


setInterval(() => {
    if(canStart){
    update();
    }
}, 20);

process.on('message', (messageObject) => {
  switch (messageObject.type) {
    case 'room' : {
      room = messageObject.data;
      canStart = true;
      break;
    }
    case 'paddle' : {
      room[messageObject.data.player] = messageObject.data;
      break;
    }
    default: {
      console.log('Type not recognized');
    }
  }
});
