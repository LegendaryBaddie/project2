const setUser = (data) =>{
    hash = data.hash;
}
const startD = (data) =>{
    //draw all players
    paddles = data.players;
    //draw ball
    ball = data.ball;
    //let people move
    active = true;
    requestAnimationFrame(redraw);
}
const update = (data) =>{
    //for updates on paddle movements
    if(paddles[data.hash].lastUpdate>=data.lastUpdate){
        return;
    }
    paddles[data.hash] = data;
    paddles[data.hash].lerp = 0.05;
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
    