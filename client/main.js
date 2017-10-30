let canvas;
let ctx;
let socket; 
let hash;
let animationFrame;
let ball = {};
let paddles = {};

const start = () => {
    ball.x = 400;
    ball.y = 400;
    ball.prevX = 400;
    ball.prevY = 400;
    ball.destX = 400;
    ball.destY = 400;
    ball.alpha = 0;
}

const init = () => {
    canvas = document.querySelector('#canvas');
    ctx = canvas.getContext('2d');
  
    socket = io.connect();
    socket.on('joined', setUser);
    socket.on('start', start);
    socket.on('updatedMovement', update);
    socket.on('ballUpdate', updateB);

    document.body.addEventListener('keydown', keyDownHandler);
    document.body.addEventListener('keyup', keyUpHandler);
  };
  
  window.onload = init;