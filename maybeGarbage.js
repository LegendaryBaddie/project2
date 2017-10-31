const checkCollision = (data,x1,y1,x2,y2,negx,negy) =>{
    let ball = data.ball;
    let u = ball.velocity.x;
    let v = ball.velocity.y;
    let a = checkLineCollide(x1,y1,x2,y2,ball.x,ball.y,ball.x+u,ball.y+v);
    let b = closestPointOnLine(x1,y1,x2,y2,u,v);
    let c = closestPointOnLine(ball.x,ball.y,u,v,x1,y2);
    let d = closestPointOnLine(ball.x,ball.y,u,v,x2,y2);
    if(a != null){  
        let vN = {
            x:ball.velocity.x/distance(0,0,ball.velocity.x,ball.velocity.y),
            y:ball.velocity.y/distance(0,0,ball.velocity.x,ball.velocity.y)
        };
        let p1 = closestPointOnLine(x1,y1,x2,y2,ball.x,ball.y);
        let p2 = {
            x: a.x -5*(distance(a.x,a.y,ball.x,ball.y)/distance(p1.x,p1.y,ball.x,ball.y))*(vN.x),
            y: a.y -5*(distance(a.x,a.y,ball.x,ball.y)/distance(p1.x,p1.y,ball.x,ball.y))*(vN.y)
        } ;
        let pC = closestPointOnLine(x1,y1,x2,y2,p2.x,p2.y);
        let p3 = {
            x: p2.x+(p1.x-pC.x),
            y: p2.y+(p1.y-pC.y)
        };
        let dV = {
            x: ball.x - 2*(p3.x-p2.x) +p2.x,
            y: ball.y - 2*(p3.y-p2.y) +p2.y
        };
        let normdV = {
            x: dV.x/(distance(0,0,dV.x,dV.y)),
            y: dV.y/(distance(0,0,dV.y,dV.y))
        }
        
        data.ball.velocity.x = negx*normdV.x*distance(0,0,ball.velocity.x,ball.velocity.y);
        data.ball.velocity.y = negy*normdV.y*distance(0,0,ball.velocity.x,ball.velocity.y);
        console.dir(data.ball.velocity);
        sockets.setRoom(data);
        return;
    }
    if(distance(b.x,b.y,ball.x+u,ball.y+v)<ball.radius){
    }
    if(distance(c.x,c.y,x1,y1)<ball.radius){
    }
    if(distance(d.x,d.y,x2,y1)<ball.radius){
    }
    sockets.setRoom(data);
    return;
}

const distance = (x1,y1,x2,y2) => {
    const a = Math.abs(x2-x1);
    const b = Math.abs(y2-y1);
    return Math.sqrt(a*a + b*b);
}
const checkLineCollide = (x1,y1,x2,y2,x3,y3,x4,y4) => {
    const A1 = y2-y1;
    const B1 = x1-x2;
    const C1 = A1*x1 + B1*y1;
    const A2 = y4-y3;
    const B2 = x3-x4;
    const C2 = A2*x3+B2*y3;
    const det = A1*B2-A2*B1;
    if(det != 0){
        const x = (B2*C1 - B1*C2)/det;
        const y = (A1*C2 - A2*C1)/det;
        
        if(((x >= Math.min(x1, x2)) && (x <= Math.max(x1, x2)))
                && ((x >= Math.min(x3, x4)) && (x <= Math.max(x3, x4)))
                && ((y >= Math.min(y1, y2)) && (y <= Math.max(y1, y2))) 
                && ((y >= Math.min(y3, y4)) && (y <= Math.max(y3, y4)))){
                return {x,y};
                }
    }
    return null;
}

const closestPointOnLine = (plx1,ply1,plx2,ply2,x0,y0) => {  
   const lx1 = plx1;
   const ly1 = ply1;
   const lx2 = plx2;
   const ly2 = ply2;
    const A1 = ly2 - ly1;
    const B1 = lx1 - lx2; 
    const C1 = (ly2-ly1) * lx1 + (lx1 - lx2) * ly1;
    const C2 = (-1*B1)*x0 + A1*y0;
    const det = A1*A1 - (-1*B1)*B1
    let cx;
    let cy;
    if(det != 0){ 
        cx = (A1*C1 - B1*C2)/det; 
        cy = (A1*C2 - (-1*B1)*C1)/det; 
    }else{ 
        cx = x0; 
        cy = y0; 
    } 
    return {x:cx, y:cy}; 
}
