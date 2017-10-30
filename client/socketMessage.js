const setUser = (data) =>{
    hash = data.hash;
    paddles[hash] = data;
    requestAnimationFrame(redraw);
}
const update = (data) =>{
    //for updates on paddle movements
}
const updateB = (data) =>{
    //for automated server tick ball updates
}
    