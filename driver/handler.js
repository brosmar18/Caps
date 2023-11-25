'use strict';

const io = require('socket.io-client');
require('dotenv').config();
const PORT = process.env.PORT || 5002;
const socket = io(`http://localhost:${PORT}/caps`)

socket.on('connect', () => {
  socket.on('pickup', (payload) => {
    console.log(`DRIVER: Picked up ${payload.orderId}`);
    socket.emit('in-transit', payload);

    setTimeout(() => {
      console.log(`DRIVER: Delivered ${payload.orderId}`);
      socket.emit('delivered', payload);
    }, 4000);
  });
});