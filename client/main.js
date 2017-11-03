let canvas;
let ctx;
let socket; 
let hash;
let animationFrame;
let ball = {};
let paddles;
let active = false;
let player = 0;


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
  
    socket = io.connect();
    socket.on('joined', setUser);
    socket.on('start', startD);
    socket.on('updatedMovement', update);
    socket.on('ballUpdate', updateB);
  
    document.body.addEventListener('keydown', keyDownHandler);
    document.body.addEventListener('keyup', keyUpHandler);
  };
  
  window.onload = init;