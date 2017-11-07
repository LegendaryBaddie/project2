"use strict";

var redraw = function redraw(time) {

    //redraw background
    ctx.clearRect(0, 0, 800, 800);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, 800, 800);

    //draw zones gonna have to check which paddles own what zones
    //save color in paddle data struc
    //assign colors via order arrived in serverroom

    //draw hexagon
    ctx.strokeStyle = "#AAAAAA";
    ctx.beginPath();
    ctx.moveTo(700, 400);
    ctx.lineTo(550, 700);
    ctx.lineTo(250, 700);
    ctx.lineTo(100, 400);
    ctx.lineTo(250, 100);
    ctx.lineTo(550, 100);
    ctx.closePath();
    ctx.stroke();

    //back zones;
    ctx.globalAlpha = .3;
    ctx.fillStyle = "#FFFF33";
    ctx.beginPath();
    ctx.moveTo(550, 700);
    ctx.lineTo(575, 750);
    ctx.lineTo(225, 750);
    ctx.lineTo(250, 700);
    ctx.closePath();
    ctx.fill();

    //cd
    ctx.fillStyle = "#FD1C03";
    ctx.beginPath();
    ctx.moveTo(250, 700);
    ctx.lineTo(225, 750);
    ctx.lineTo(50, 400);
    ctx.lineTo(100, 400);
    ctx.closePath();
    ctx.fill();

    //DE
    ctx.fillStyle = "#00FF33";
    ctx.beginPath();
    ctx.moveTo(100, 400);
    ctx.lineTo(50, 400);
    ctx.lineTo(225, 50);
    ctx.lineTo(250, 100);
    ctx.closePath();
    ctx.fill();
    //EF
    ctx.fillStyle = "#099FFF";
    ctx.beginPath();
    ctx.moveTo(250, 100);
    ctx.lineTo(225, 50);
    ctx.lineTo(575, 50);
    ctx.lineTo(550, 100);
    ctx.closePath();
    ctx.fill();

    //FA
    ctx.fillStyle = "#FF00CC";
    ctx.beginPath();
    ctx.moveTo(550, 100);
    ctx.lineTo(575, 50);
    ctx.lineTo(750, 400);
    ctx.lineTo(700, 400);
    ctx.closePath();
    ctx.fill();

    //AB
    ctx.fillStyle = "#9900FF";
    ctx.beginPath();
    ctx.moveTo(700, 400);
    ctx.lineTo(750, 400);
    ctx.lineTo(575, 750);
    ctx.lineTo(550, 700);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = 1;
    //lerp paddles
    for (var i = 0; i < paddles.length; i++) {
        if (paddles[i].lerp < 1) paddles[i].lerp += 0.5;
        paddles[i].x = lerp(paddles[i].prevX, paddles[i].destX, paddles[i].lerp);
        paddles[i].y = lerp(paddles[i].prevY, paddles[i].destY, paddles[i].lerp);
    }
    //draw paddles
    //cant really itrate through
    var x = void 0;
    var y = void 0;
    //#FFFF33 #FD1C03 #00FF33 #099FFF #FF00CC #9900FF
    //p1
    if (paddles[0].alive) {
        x = paddles[0].x;
        y = paddles[0].y;
        ctx.strokeStyle = "#FFFF33";
        ctx.strokeRect(x - 25, y - 5, 51, 10);
    }

    //p2
    if (paddles[1].alive) {
        x = paddles[1].x;
        y = paddles[1].y;
        ctx.strokeStyle = "#FD1C03";

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-0.447 - Math.PI / 2);
        ctx.strokeRect(-25, -5, 51, 10);
        ctx.restore();
    }

    //p3
    if (paddles[2].alive) {
        x = paddles[2].x;
        y = paddles[2].y;
        ctx.strokeStyle = "#00FF33";

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(.447 + Math.PI / 2);
        ctx.strokeRect(-25, -5, 51, 10);
        ctx.restore();
    }

    //p4
    if (paddles[3].alive) {
        x = paddles[3].x;
        y = paddles[3].y;
        ctx.strokeStyle = "#099FFF";
        ctx.strokeRect(x - 25, y - 5, 51, 10);
    }

    //p5
    if (paddles[4].alive) {
        x = paddles[4].x;
        y = paddles[4].y;
        ctx.strokeStyle = "#FF00CC";

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-0.447 - Math.PI / 2);
        ctx.strokeRect(-25, -5, 51, 10);
        ctx.restore();
    }
    //p6
    if (paddles[5].alive) {
        x = paddles[5].x;
        y = paddles[5].y;
        ctx.strokeStyle = "#9900FF";

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(.447 + Math.PI / 2);
        ctx.strokeRect(-25, -5, 51, 10);
        ctx.restore();
    }

    //lerp ball pos
    if (ball.lerp < 1) ball.lerp += 0.05;
    ball.x = lerp(ball.prevX, ball.destX, ball.lerp);
    ball.y = lerp(ball.prevY, ball.destY, ball.lerp);
    ball.prevX = ball.x;
    ball.prevY = ball.y;
    //draw ball

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, 5, 0, 2 * Math.PI, false);
    ctx.fillStyle = "#FFF";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000";
    ctx.stroke();

    animationFrame = requestAnimationFrame(redraw);
};

var lerp = function lerp(v0, v1, alpha) {
    return (1 - alpha) * v0 + alpha * v1;
};
'use strict';

var canvas = void 0;
var ctx = void 0;
var socket = void 0;
var hash = void 0;
var animationFrame = void 0;
var ball = {};
var paddles = void 0;
var active = false;
var player = 0;

var keyDownHandler = function keyDownHandler(e) {
  var keyPressed = e.which;
  var paddle = paddles[player];
  if (keyPressed === 65 || keyPressed === 37) {
    paddle.moveLeft = true;
  }
  // D OR RIGHT
  else if (keyPressed === 68 || keyPressed === 39) {
      paddle.moveRight = true;
    }
  updatePosition();
};
var keyUpHandler = function keyUpHandler(e) {
  var keyPressed = e.which;
  var paddle = paddles[player];
  if (keyPressed === 65 || keyPressed === 37) {
    paddle.moveLeft = false;
  }
  // D OR RIGHT
  else if (keyPressed === 68 || keyPressed === 39) {
      paddle.moveRight = false;
    }
  updatePosition();
};

var init = function init() {
  canvas = document.querySelector('#canvas');
  ctx = canvas.getContext('2d');

  socket = io.connect();
  socket.on('joined', setUser);
  socket.on('start', startD);
  socket.on('updatedMovement', update);
  socket.on('ballUpdate', updateB);
  socket.on('death', death);

  document.body.addEventListener('keydown', keyDownHandler);
  document.body.addEventListener('keyup', keyUpHandler);
};

window.onload = init;
'use strict';

var setUser = function setUser(data) {
    hash = data;
};
var startD = function startD(data) {
    //draw all players
    paddles = data.players;
    console.dir(paddles);
    for (var i = 0; i < paddles.length; i++) {
        if (paddles[i].hash === hash) {
            player = i;
        };
        paddles[i].prevX = data.players[i].x;
        paddles[i].prevY = data.players[i].y;
        paddles[i].destX = data.players[i].x;
        paddles[i].destY = data.players[i].y;
    }
    //draw ball
    ball = data.ball;
    //let people move
    active = true;
    requestAnimationFrame(redraw);
};
var update = function update(data) {
    //for updates on paddle movements
    if (paddles[data.player].lastUpdate >= data.lastUpdate) {
        return;
    }
    paddles[data.player] = data;
    paddles[data.player].lerp = 0.05;
};
var updateB = function updateB(data) {
    //for automated server tick ball updates
    if (ball.lastUpdate >= data.lastUpdate) {
        return;
    }
    ball.destX = data.destX;
    ball.destY = data.destY;
    ball.lerp = 0.05;
};

var death = function death(data) {
    paddles[data.player].alive = false;
};

var updatePosition = function updatePosition() {
    var paddle = paddles[player];

    paddle.prevX = paddle.x;
    paddle.prevY = paddle.y;
    var uN = void 0;
    switch (paddle.player) {
        case 0:
            //keep between 250 and 550 x and just add 
            if (paddle.moveLeft && paddle.destX > 285) {
                paddle.destX -= 15;
            }
            //if user is moving right, increase x
            if (paddle.moveRight && paddle.destX < 515) {
                paddle.destX += 15;
            }
            break;
        case 1:
            uN = { x: 0.447, y: 0.894 };
            if (paddle.moveLeft && paddle.destX > 115) {
                paddle.destX -= 15 * uN.x;
                paddle.destY -= 15 * uN.y;
            }
            //if user is moving right, increase x
            if (paddle.moveRight && paddle.destX < 235) {
                paddle.destX += 15 * uN.x;
                paddle.destY += 15 * uN.y;
            }
            break;
        case 2:
            uN = { x: 0.447, y: -0.894 };
            if (paddle.moveLeft && paddle.destX > 115) {
                paddle.destX -= 15 * uN.x;
                paddle.destY -= 15 * uN.y;
            }
            //if user is moving right, increase x
            if (paddle.moveRight && paddle.destX < 235) {
                paddle.destX += 15 * uN.x;
                paddle.destY += 15 * uN.y;
            }
            break;
        case 3:
            //keep between 250 and 550 x and just add 
            if (paddle.moveLeft && paddle.destX > 285) {
                paddle.destX -= 15;
            }
            //if user is moving right, increase x
            if (paddle.moveRight && paddle.destX < 515) {
                paddle.destX += 15;
            }
            break;
        case 4:
            uN = { x: 0.447, y: 0.894 };
            if (paddle.moveLeft && paddle.destX > 565) {
                paddle.destX -= 15 * uN.x;
                paddle.destY -= 15 * uN.y;
            }
            //if user is moving right, increase x
            if (paddle.moveRight && paddle.destX < 685) {
                paddle.destX += 15 * uN.x;
                paddle.destY += 15 * uN.y;
            }
            break;
        case 5:
            uN = { x: 0.447, y: -0.894 };
            if (paddle.moveLeft && paddle.destX > 565) {
                paddle.destX -= 15 * uN.x;
                paddle.destY -= 15 * uN.y;
            }
            //if user is moving right, increase x
            if (paddle.moveRight && paddle.destX < 685) {
                paddle.destX += 15 * uN.x;
                paddle.destY += 15 * uN.y;
            }
            break;
        default:
            break;
    }

    paddle.alpha = 0.05;
    socket.emit('movementUpdate', paddle);
};
