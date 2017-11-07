const xxh = require('xxhashjs');
const Paddle = require('./classes/paddle.js');
const Ball = require('./classes/ball.js');
const child = require('child_process');
const Message = require('./classes/Message.js');
let io;
// contains which users are together in one room maybe makes it faster might be useless
const rooms = {};
// creates new rooms
let newRoom = null;
// tells what room individual socket is in.
const sockRoomRef = {};

const physics = child.fork('./server/physics.js');

physics.on('message', (m) => {
  switch(m.type) {
    case 'ball': {
      //setRoom(m.data);
      io.sockets.in(`${m.data.name}`).emit('ballUpdate', m.data.ball);
      break;
    }
    case 'death':{
      io.sockets.in(`${sockRoomRef[m.data.hash]}`).emit('death', m.data);
      break;
    }
    default: {
      console.log('Received unclear type from physics');
    }
  }
});
//when we receive an error from our physics process
physics.on('error', (error) => {
  console.dir(error);
});

//when our physics process closes - meaning the process exited
//and all streams/files/etc have been closed
physics.on('close', (code, signal) => {
  console.log(`Child closed with ${code} ${signal}`);
});

//when our physics process exits - meaning it finished processing
//but there might still be streams/files/etc open
physics.on('exit', (code, signal) => {
  console.log(`Child exited with ${code} ${signal}`);
});



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
        case 1:{
            // add player to new room obj
          newRoom.players.push(new Paddle(hash, 1,175,550));
          socket.join(`${newRoom.name}`);
          sockRoomRef[hash] = newRoom.name;
          socket.emit('joined', hash);
          break;
        }
        case 2:{
          newRoom.players.push(new Paddle(hash, 2,175,250));
          socket.join(`${newRoom.name}`);
          sockRoomRef[hash] = newRoom.name;
          socket.emit('joined', hash);
          break;
        } 
        case 3:{
          newRoom.players.push(new Paddle(hash,3,400,100));
          socket.join(`${newRoom.name}`);
          sockRoomRef[hash] = newRoom.name;
          socket.emit('joined', hash);
          break;
        }
        case 4:{
          newRoom.players.push(new Paddle(hash,4,625,250));
          socket.join(`${newRoom.name}`);
          sockRoomRef[hash] = newRoom.name;
          socket.emit('joined', hash);
          break;
        }
        case 5: {
            // add to rooms obj then reset for a new room
          newRoom.players.push(new Paddle(hash,5,625,550));
          socket.join(`${newRoom.name}`);
          sockRoomRef[hash] = newRoom.name;
          rooms[newRoom.name] = newRoom;
          socket.emit('joined', hash);
          io.sockets.in(`${newRoom.name}`).emit('start', newRoom);
          physics.send(new Message('room', newRoom));
          newRoom = null;
          break;
        }
        default:{
          console.dir(newRoom);
          break;
        }
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
      //update physics sim
      physics.send(new Message('paddle', rooms[curRoom].players[player])); 

      io.sockets.in(`${curRoom}`).emit('updatedMovement', rooms[curRoom].players[player]);
    });
  });
};

const setRoom = (data) => {
  rooms[data.name] = data;
};

module.exports.setupSockets = setupSockets;
