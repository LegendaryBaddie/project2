const xxh = require('xxhashjs');
const Paddle = require('./classes/paddle.js');
const Ball = require('./classes/ball.js');
const physics = require('./physics.js');

let io;
// contains which users are together in one room maybe makes it faster might be useless
const rooms = {};
// creates new rooms
let newRoom = null;
// tells what room individual socket is in.
const sockRoomRef = {};

const setupSockets = (ioServer) => {
  io = ioServer;

  io.on('connection', (sock) => {
    const socket = sock;
    const hash = xxh.h32(`${socket.id}${new Date().getTime()}`, 0xCAFEBABE).toString(16);
    socket.hash = hash;

        // join room logic
        // check if we need to make a new room
    if (newRoom != null) {
      switch (newRoom.players.length) {
        case 1:
            // add player to new room obj
          newRoom.players.push(new Paddle(hash, 1,175,550));
          socket.join(`${newRoom.name}`);
          sockRoomRef[hash] = newRoom.name;
          socket.emit('joined', hash);
          break;
        case 2:
          newRoom.players.push(new Paddle(hash, 2,175,250));
          socket.join(`${newRoom.name}`);
          sockRoomRef[hash] = newRoom.name;
          socket.emit('joined', hash);
          break;
        case 3:
          newRoom.players.push(new Paddle(hash,3,400,100));
          socket.join(`${newRoom.name}`);
          sockRoomRef[hash] = newRoom.name;
          socket.emit('joined', hash);
          break;
        case 4:
          newRoom.players.push(new Paddle(hash,4,625,250));
          socket.join(`${newRoom.name}`);
          sockRoomRef[hash] = newRoom.name;
          socket.emit('joined', hash);
          break;
        case 5:
            // add to rooms obj then reset for a new room
          newRoom.players.push(new Paddle(hash,5,625,550));
          socket.join(`${newRoom.name}`);
          sockRoomRef[hash] = newRoom.name;
          rooms[newRoom.name] = newRoom;
          socket.emit('joined', hash);
          io.sockets.in(`${newRoom.name}`).emit('start', newRoom);
          console.log('hey');
          newRoom = null;
          setInterval(() => {
            const keys = Object.keys(rooms);
            for (let i = 0; i < keys.length; i++) {
              physics.update(rooms[keys[i]]);
              io.sockets.in(`${keys[i]}`).emit('ballUpdate', rooms[keys[i]].ball);
            }
          }, 30);
          break;
        default:
          console.dir(newRoom);
          break;
      }
    } else {
            // create a new room
      newRoom = {};
      newRoom.name = hash;
      newRoom.players = [];
      newRoom.players.push(new Paddle(hash, 0,400,700));
      newRoom.ball = new Ball(400);
      socket.join(`${newRoom.name}`);
      sockRoomRef[hash] = newRoom.name;
      socket.emit('joined', hash);
      console.log(1);
    }


    socket.on('movementUpdate', (data) => {
      const curRoom = sockRoomRef[socket.hash];
            // update physics sim
            // get which player the socket is
      let player = data.player;

      rooms[curRoom].players[player] = data;
      rooms[curRoom].players[player].lastUpdate = new Date().getTime();
            // run a cycle to update ball movement
      //physics.update(rooms[curRoom]);
            // update rest of clients
      io.sockets.in(`${curRoom}`).emit('updatedMovement', rooms[curRoom].players[player]);
    });
  });
};

const setRoom = (data) => {
  rooms[data.name] = data;
};

module.exports.setRoom = setRoom;
module.exports.setupSockets = setupSockets;
