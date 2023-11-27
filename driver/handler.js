'use strict';
require('dotenv').config();
const SocketClient = require('../server/lib/SocketClient');

const clientId = 'driver';
const PORT = process.env.PORT || 5002;
const serverUrl = `http://localhost:${PORT}/caps`;

function handlePickup(payload) {
  console.log(`DRIVER: Picked up order ID ${payload.orderId}`);
  console.log(`DRIVER: Order ID ${payload.orderId} is now In-Transit`);
  this.publish('in-transit', payload);

  setTimeout(() => {
    this.handleDelivered(payload);
  }, 4000);
}

function handleDelivered(payload) {
  console.log(`DRIVER: Delivered order ID ${payload.orderId}`);
  this.publish('delivered', payload);
}

function startDriverProcess() {
  const socketClient = new SocketClient(clientId, serverUrl);

  // Binding this context to handlePickup and handleDelivered
  socketClient.handlePickup = handlePickup.bind(socketClient);
  socketClient.handleDelivered = handleDelivered.bind(socketClient);

  socketClient.subscribe('pickup', socketClient.handlePickup);
  
  socketClient.socket.emit('getAll', { clientId: clientId, event: 'pickup' });
}

module.exports = { startDriverProcess };
