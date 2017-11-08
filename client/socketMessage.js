const setUser = (data) =>{
    hash = data;
}
const startD = (data) =>{
    //draw all players
    paddles = data.players;
    console.dir(paddles);
    for(let i = 0; i<paddles.length; i++){
        if(paddles[i].hash === hash){player = i};
        paddles[i].prevX =  data.players[i].x;
        paddles[i].prevY =  data.players[i].y;
        paddles[i].destX =  data.players[i].x;
        paddles[i].destY =  data.players[i].y;
        
    }
    //draw ball
    ball = data.ball;
    //let people move
    win = false;
    newestDead = '';
    active = true;
    requestAnimationFrame(redraw);
}
const update = (data) =>{
    //for updates on paddle movements
    if(paddles[data.player].lastUpdate>=data.lastUpdate){
        return;
    }
    paddles[data.player] = data;
    paddles[data.player].lerp = 0.05;
}
const updateB = (data) =>{
    //for automated server tick ball updates
    if(ball.lastUpdate >= data.lastUpdate){
        return;
    }
    ball.destX = data.destX;
    ball.destY = data.destY;
    ball.lerp = 0.05;
}

const death = (data) => {
    paddles[data.player].alive = false;
    let deadCount = 0;
    for(let i = 0; i<paddles.length; i++ ){
        if(paddles[i].alive ===false){
            deadCount++;
        }
    }
    if(deadCount>=5 && paddles[player].alive){
      win = true;
      socket.emit('killRoom');
    }else{
        if(paddles[data.player].hash === hash)
        {
            active = false;
            newestDead = "You";
        }else{
            newestDead = `Player ${data.player + 1}`;
        }
    }
}

const updatePosition = () => {
    const paddle = paddles[player];
    
    paddle.prevX = paddle.x;
    paddle.prevY = paddle.y;
    let uN;
    switch (paddle.player) {
        case 0:
            //keep between 250 and 550 x and just add 
            if(paddle.moveLeft && paddle.destX > 285) {
                paddle.destX -= 15;
            }
            //if user is moving right, increase x
            if(paddle.moveRight && paddle.destX < 515) {
                paddle.destX += 15;
            }
            break;
        case 1:
            uN = {x:0.447, y:0.894};
            if(paddle.moveLeft && paddle.destX > 115) {
                paddle.destX -= 15*uN.x;
                paddle.destY -= 15*uN.y;
            }
            //if user is moving right, increase x
            if(paddle.moveRight && paddle.destX < 235) {
                paddle.destX += 15*uN.x;
                paddle.destY += 15*uN.y;
            }
            break;
        case 2:
            uN = {x:0.447, y:-0.894};
            if(paddle.moveLeft && paddle.destX > 115) {
                paddle.destX -= 15*uN.x;
                paddle.destY -= 15*uN.y;
            }
            //if user is moving right, increase x
            if(paddle.moveRight && paddle.destX < 235) {
                paddle.destX += 15*uN.x;
                paddle.destY += 15*uN.y;
            }
            break;
        case 3:
        //keep between 250 and 550 x and just add 
        if(paddle.moveLeft && paddle.destX > 285) {
            paddle.destX -= 15;
        }
        //if user is moving right, increase x
        if(paddle.moveRight && paddle.destX < 515) {
            paddle.destX += 15;
        }
        break;
        case 4:
            uN = {x:0.447, y:0.894};
            if(paddle.moveLeft && paddle.destX > 565) {
                paddle.destX -= 15*uN.x;
                paddle.destY -= 15*uN.y;
            }
            //if user is moving right, increase x
            if(paddle.moveRight && paddle.destX < 685) {
                paddle.destX += 15*uN.x;
                paddle.destY += 15*uN.y;
            }
            break;
        case 5:
            uN = {x:0.447, y:-0.894};
            if(paddle.moveLeft && paddle.destX > 565) {
                paddle.destX -= 15*uN.x;
                paddle.destY -= 15*uN.y;
            }
            //if user is moving right, increase x
            if(paddle.moveRight && paddle.destX < 685) {
                paddle.destX += 15*uN.x;
                paddle.destY += 15*uN.y;
            }
        break;
        default:
        break;
    }

    paddle.lerp = 0.35;
    socket.emit('movementUpdate', paddle);
};