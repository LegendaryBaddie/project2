const xxh = require('xxhashjs');

let io;
let rooms = [];
let newRoom = {};
const setupSockets = (ioServer) => {
    io = ioServer;

    io.on('connection', (sock) => {
        const socket = sock;
        const hash = xxh.h32(`${socket.id}${new Date().getTime()}`, 0xCAFEBABE).toString(16);
        socket.hash = hash;

        //join room logic
        //check if we need to make a new room
        if(newRoom != null)
        {
           switch (newRoom.players){
            case 1:
                newRoom.p2 = hash;
                newRoom.players = 2;
                socket.join(`${newRoom.name}`);
                break;
            case 2:
                newRoom.p3 = hash;
                newRoom.players = 3;
                socket.join(`${newRoom.name}`);
                break;
            case 3:
                newRoom.p4 = hash;
                newRoom.players = 4;
                socket.join(`${newRoom.name}`);
                break;
            case 4:
                newRoom.p5 = hash;
                newRoom.players = 5;
                socket.join(`${newRoom.name}`);
                break;
            case 5:
                newRoom.p6 = hash;
                socket.join(`${newRoom.name}`);
                rooms.push(newRoom);
                newRoom = {};
                break;
            default:
                console.dir(newRoom);
                break;
           }
        }else{
            //create a new room 
            newRoom.name = hash;
            newRoom.p1 = hash;
            newRoom.players = 1;
            socket.join(`${newRoom.name}`);
        }
        //add char to group
        socket.emit('joined', hash);
        

    });
};

module.exports.setupSockets = setupSockets;