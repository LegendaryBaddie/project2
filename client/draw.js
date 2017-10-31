const redraw = (time) => {
    //updatePositions();
    
    //redraw background
    ctx.clearRect(0,0,800,800);
    ctx.fillStyle = "#000";
    ctx.fillRect(0,0,800,800);

    //draw zones gonna have to check which paddles own what zones
    //save color in paddle data struc
    //assign colors via order arrived in serverroom

    //draw hexagon
    ctx.strokeStyle = "#AAAAAA";
    ctx.beginPath();
    ctx.moveTo(700,400);
    ctx.lineTo(550,700);
    ctx.lineTo(250,700);
    ctx.lineTo(100,400);
    ctx.lineTo(250,100);
    ctx.lineTo(550,100);
    ctx.closePath();
    ctx.stroke();

    //draw paddles

    //lerp ball pos
    if(ball.lerp<1) ball.lerp += 0.05;
    ball.x = lerp(ball.prevX, ball.destX, ball.lerp);
    ball.y = lerp(ball.prevY, ball.destY, ball.lerp);
    ball.prevX = ball.x;
    ball.prevY = ball.y;
    //draw ball
    
    ctx.beginPath();
    ctx.arc(ball.x,ball.y, 5, 0, 2 * Math.PI, false);
    ctx.fillStyle = "#FFF";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000";
    ctx.stroke();
    
    animationFrame = requestAnimationFrame(redraw);
};

const updatePositions = () =>{
    let paddle = paddles[hash];
    paddle.prevX = paddle.x;
    paddle.prevY = paddle.y;

    //put movementcodeinHere

    paddle.alpha = 0.05;
    socket.emit('movementUpdate', paddle);
}

const lerp = (v0, v1, alpha) => {
    return (1 - alpha) * v0 + alpha * v1;
};