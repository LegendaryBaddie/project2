const redraw = (time) => {
    
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

    //lerp paddles
    for(let i=0; i<paddles.length; i++){
       if(paddles[i].lerp<1) paddles[i].lerp+=0.5;
       paddles[i].x = lerp(paddles[i].prevX,paddles[i].destX,paddles[i].lerp);
       paddles[i].y = lerp(paddles[i].prevY,paddles[i].destY,paddles[i].lerp);
    }
    //draw paddles
    //cant really itrate through
    let x;
    let y;
    //#FFFF33 #FD1C03 #00FF33 #099FFF #FF00CC #9900FF
    //p1
    x=paddles[0].x;
    y=paddles[0].y;
    ctx.strokeStyle = "#FFFF33";
    ctx.strokeRect(x-25,y-5,51,10);

    //p2
    x=paddles[1].x;
    y=paddles[1].y;
    ctx.strokeStyle = "#FD1C03";

    ctx.save();
        ctx.translate(x,y);
        ctx.rotate(-0.447 - Math.PI/2);
        ctx.strokeRect(-25,-5,51,10);
    ctx.restore();
    
    //p3
    x=paddles[2].x;
    y=paddles[2].y;
    ctx.strokeStyle = "#00FF33";

    ctx.save();
        ctx.translate(x,y);
        ctx.rotate(.447+Math.PI/2);
        ctx.strokeRect(-25,-5,51,10);
    ctx.restore();

    //p4
    x=paddles[3].x;
    y=paddles[3].y;
    ctx.strokeStyle = "#099FFF";
    ctx.strokeRect(x-25,y-5,51,10);

    //p5
    x=paddles[4].x;
    y=paddles[4].y;
    ctx.strokeStyle = "#FF00CC";

    ctx.save();
        ctx.translate(x,y);
        ctx.rotate(-0.447 - Math.PI/2);
        ctx.strokeRect(-25,-5,51,10);
    ctx.restore();

    //p6
    x=paddles[5].x;
    y=paddles[5].y;
    ctx.strokeStyle = "#9900FF";

    ctx.save();
        ctx.translate(x,y);
        ctx.rotate(.447+Math.PI/2);
        ctx.strokeRect(-25,-5,51,10);
    ctx.restore();

    
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


const lerp = (v0, v1, alpha) => {
    return (1 - alpha) * v0 + alpha * v1;
};