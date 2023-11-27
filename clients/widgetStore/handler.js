'use strict';

const io = require('socket.io-client');
const Chance = require('chance');
const chance = new Chance();
require('dotenv').config();
const PORT = process.env.PORT || 5002;
const storeName = 'acme-widgets'; 

function createOrder() {
  return {
    store: storeName,
    orderId: chance.guid(),
    customer: chance.name(),
    address: `${chance.city()}, ${chance.state({ full: true })}`
  };
}

function startWidgetStoreProcess() {
  const socket = io(`http://localhost:${PORT}/caps`);

  socket.on('connect', () => {
    console.log(`Widget Store connected to CAPS server as ${storeName}`);
    socket.emit('join', storeName);
    socket.emit('getAll', { clientId: storeName, event: 'delivered' });

    setInterval(() => {
      const order = createOrder();
      console.log(`Widget Store: New pickup request for order ID ${order.orderId}`);
      socket.emit('pickup', order);
    }, 5000);

    socket.on('in-transit', (payload) => {
      console.log(`Widget Store: Order ID ${payload.orderId} is In-Transit`);
    });

    socket.on('delivered', (payload) => {
      console.log(`Widget Store: Order ID ${payload.orderId} has been Delivered`);
      console.log(`Widget Store: Thank you for delivering order ID ${payload.orderId}`);
      socket.emit('received', { clientId: storeName, event: 'delivered', messageId: payload.orderId });
    });
  });
}

module.exports = { startWidgetStoreProcess };
