'use strict';

const io = require('socket.io-client');
const Chance = require('chance');
const chance = new Chance();
require('dotenv').config();
const PORT = process.env.PORT || 5002;
const storeName = '1-206-flowers';

function createOrder(storeName) {
  return {
    store: storeName,
    orderId: chance.guid(),
    customer: chance.name(),
    address: `${chance.city()}, ${chance.state({ full: true })}`
  };
}

function startVendorProcess() {
  const socket = io(`http://localhost:${PORT}/caps`);

  socket.on('connect', () => {
    console.log(`Vendor connected to CAPS server as ${storeName}`);
    socket.emit('join', storeName);

    setInterval(() => {
      const order = createOrder(storeName);
      console.log(`VENDOR: New pickup request for order ID ${order.orderId}`);
      socket.emit('pickup', order);
    }, 5000);

    socket.on('in-transit', (payload) => {
      console.log(`VENDOR: Order ID ${payload.orderId} is In-Transit`);
    });

    socket.on('delivered', (payload) => {
      console.log(`VENDOR: Order ID ${payload.orderId} has been Delivered`);
      console.log(`VENDOR: Thank you for delivering order ID ${payload.orderId}`);
    });
  });
}

module.exports = { createOrder, startVendorProcess };