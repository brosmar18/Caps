'use strict';

const io = require('socket.io-client');
const Chance = require('chance');
const chance = new Chance();

require('dotenv').config();
const PORT = process.env.PORT || 5002;
const socket = io(`http://localhost:${PORT}/caps`)


// Create Order
function createOrder(storeName) {
  return {
    store: storeName,
    orderId: chance.guid(),
    customer: chance.name(),
    address: `${chance.city()}, ${chance.state({ full: true })}`
  };
}

const storeName = '1-206-flowers';


socket.on('connect', () => {
  socket.emit('join', storeName);
  setInterval(() => {
    const order = createOrder(storeName);
    console.log('VENDOR: New pickup request', order);
    socket.emit('pickup', order);
  }, 5000);

  socket.on('delivered', (payload) => {
    console.log(`VENDOR: Thank you for delivering ${payload.orderId}`);
  });
});