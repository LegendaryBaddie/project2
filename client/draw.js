const redraw = (time) => {
    //redraw background
    ctx.clearRect(0,0,800,800);
    ctx.fillStyle = "#000";
    ctx.fillRect(0,0,800,800);

    //draw zones gonna have to check which paddles own what zones
    //save color in paddle data struc
    //assign colors via order arrived in serverroom

    //draw paddles

    //lerp ball pos
    ball.x = lerp(ball.prevX, ball.destX, ball.alpha);
    ball.y = lerp(ball.prevY, ball.destY, ball.alpha);
    //draw ball
    ctx.beginPath();
    ctx.arc(ball.x,ball.y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = "#FFF";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000";
    ctx.stroke();

    animationFrame = requestAnimationFrame(redraw);
};

const lerp = (v0, v1, alpha) => {
    return (1 - alpha) * v0 + alpha * v1;
};