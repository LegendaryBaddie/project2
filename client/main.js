let canvas;
let ctx;
let socket; 
let hash;
let animationFrame;
let ball = {};
let paddles;
let active = false;
let player = 0;
let newestDead = '';
let win = false;


const keyDownHandler = (e) =>{
  var keyPressed = e.which;
  const paddle = paddles[player];
  if(keyPressed === 65 || keyPressed === 37) {
    paddle.moveLeft = true;
  }
  // D OR RIGHT
  else if(keyPressed === 68 || keyPressed === 39) {
    paddle.moveRight = true;
  }
  
  updatePosition();
  
};
const keyUpHandler = (e) =>{
  var keyPressed = e.which;
  const paddle = paddles[player];
  if(keyPressed === 65 || keyPressed === 37) {
    paddle.moveLeft = false;
  }
  // D OR RIGHT
  else if(keyPressed === 68 || keyPressed === 39) {
    paddle.moveRight = false;
  }
  
  updatePosition();
  
};

const init = () => {
    canvas = document.querySelector('#canvas');
    ctx = canvas.getContext('2d');
    ctx.save();
      ctx.fillStyle = "#000";
      ctx.fillRect(0,0,800,800);
      ctx.strokeStyle = "#FFF";
      ctx.lineWidth = 2;
      ctx.font = "normal normal 600 60px Exo";
      ctx.strokeText('Waiting for more players!', 50,400);
    ctx.restore();
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