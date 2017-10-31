let canvas;
let ctx;
let socket; 
let hash;
let animationFrame;
let ball = {};
let paddles = {};
let active = false;

const keyDownHandler = (e) =>{

};
const keyUpHandler = (e) =>{
    
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