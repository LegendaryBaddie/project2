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
const physics = {};


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
        case 1: {
            // add player to new room obj
          newRoom.players.push(new Paddle(hash, 1, 175, 550));
          socket.join(`${newRoom.name}`);
          sockRoomRef[hash] = newRoom.name;
          socket.emit('joined', hash);
          break;
        }
        case 2: {
          newRoom.players.push(new Paddle(hash, 2, 175, 250));
          socket.join(`${newRoom.name}`);
          sockRoomRef[hash] = newRoom.name;
          socket.emit('joined', hash);
          break;
        }
        case 3: {
          newRoom.players.push(new Paddle(hash, 3, 400, 100));
          socket.join(`${newRoom.name}`);
          sockRoomRef[hash] = newRoom.name;
          socket.emit('joined', hash);
          break;
        }
        case 4: {
          newRoom.players.push(new Paddle(hash, 4, 625, 250));
          socket.join(`${newRoom.name}`);
          sockRoomRef[hash] = newRoom.name;
          socket.emit('joined', hash);
          break;
        }
        case 5: {
            // add to rooms obj then reset for a new room
          newRoom.players.push(new Paddle(hash, 5, 625, 550));
          socket.join(`${newRoom.name}`);
          sockRoomRef[hash] = newRoom.name;
          rooms[newRoom.name] = newRoom;
          socket.emit('joined', hash);
          io.sockets.in(`${newRoom.name}`).emit('start', newRoom);
          physics[newRoom.name].send(new Message('room', newRoom));
          newRoom = null;
          break;
        }
        default: {
          console.dir(newRoom);
          break;
        }
      }
    } else {
            // create a new room
      newRoom = {};
      newRoom.name = hash;
      newRoom.players = [];
      newRoom.players.push(new Paddle(hash, 0, 400, 700));
      newRoom.ball = new Ball(400, 3);
      physics[newRoom.name] = child.fork('./server/physics.js');
      socket.join(`${newRoom.name}`);
      sockRoomRef[hash] = newRoom.name;
      socket.emit('joined', hash);
    }

    physics[sockRoomRef[socket.hash]].on('message', (m) => {
      switch (m.type) {
        case 'ball': {
          // setRoom(m.data);
          io.sockets.in(`${m.data.name}`).emit('ballUpdate', m.data.ball);
          break;
        }
        case 'death': {
          io.sockets.in(`${sockRoomRef[m.data.hash]}`).emit('death', m.data);
          break;
        }
        default: {
          console.log('Received unclear type from physics');
        }
      }
    });
    // when we receive an error from our physics process
    physics[sockRoomRef[socket.hash]].on('error', (error) => {
      console.dir(error);
    });

    // when our physics process closes - meaning the process exited
    // and all streams/files/etc have been closed
    physics[sockRoomRef[socket.hash]].on('close', (code, signal) => {
      console.log(`Child closed with ${code} ${signal}`);
    });

    // when our physics process exits - meaning it finished processing
    // but there might still be streams/files/etc open
    physics[sockRoomRef[socket.hash]].on('exit', (code, signal) => {
      console.log(`Child exited with ${code} ${signal}`);
    });
    socket.on('killRoom', () => {
      // remove phsyics ref
      if (physics[sockRoomRef[socket.hash]] === undefined) {
        // do nothing
      } else {
        physics[sockRoomRef[socket.hash]].kill();
        delete physics[sockRoomRef[socket.hash]];
      // disconnect all sockets in room
        for (let i = 0; i < rooms[sockRoomRef[socket.hash]].players.length; i++) {
          if (io.sockets.connected[rooms[sockRoomRef[socket.hash]].players[i].hash] !== undefined) {
            io.sockets.connected[rooms[sockRoomRef[socket.hash]].players[i].hash].disconnect();
          }
        }
      // remove room
        delete rooms[sockRoomRef[socket.hash]];
      }
    });
    socket.on('movementUpdate', (udata) => {
      const data = udata;
      data.lastUpdate = new Date().getTime();
      // update physics sim
      physics[sockRoomRef[socket.hash]].send(new Message('paddle', data));
      io.sockets.in(`${sockRoomRef[socket.hash]}`).emit('updatedMovement', data);
    });
  });
};

module.exports.setupSockets = setupSockets;
