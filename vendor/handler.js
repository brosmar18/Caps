'use strict';

const Chance = require('chance');
const chance = new Chance();
const eventPool = require('../eventPool');

// Create Order
function createOrder(storeName) {
  return {
    store: storeName,
    orderId: chance.guid(),
    customer: chance.name(),
    address: `${chance.city()}, ${chance.state({ full: true })}`
  };
}

// Function to start the order creation process
function startOrderProcess() {
  setInterval(() => {
    const order = createOrder('TheVendor');
    console.log('VENDOR: New pickup request', order);
    setTimeout(() => {
      eventPool.emit('pickup', order);
    }, 2000); 
  }, 30000); 
}

// Delivery response
const handleDelivery = (payload) => {
  console.log(`VENDOR: Thanks for delivering the order: ${payload.orderId}`);
}

eventPool.on('delivered', handleDelivery);

module.exports = { handleDelivery, startOrderProcess };
