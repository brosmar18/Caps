'use strict';

const io = require('socket.io-client');
require('dotenv').config();
const PORT = process.env.PORT || 5002;
const socket = io(`http://localhost:${PORT}/caps`);

function handlePickup(payload) {
  console.log(`DRIVER: Picked up order ID ${payload.orderId}`);
  console.log(`DRIVER: Order ID ${payload.orderId} is now In-Transit`);
  socket.emit('in-transit', payload);

  setTimeout(() => {
    handleDelivered(payload);
  }, 4000);
}

function handleDelivered(payload) {
  console.log(`DRIVER: Delivered order ID ${payload.orderId}`);
  socket.emit('delivered', payload);
}

socket.on('connect', () => {
  console.log('Driver connected to the CAPS server');

  socket.on('pickup', handlePickup);
});

module.exports = { handlePickup, handleDelivered };
