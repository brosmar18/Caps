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

// Pick Up request
setInterval(() => {
  const order = createOrder('TheVendor'); 
  console.log('VENDOR: New pickup request', order);
  eventPool.emit('pickup', order);
}, 5000);

// Delivery response
const handleDelivery = (payload) => {
  console.log(`VENDOR: Thanks for delivering the order: ${payload.orderId}`);
}

eventPool.on('delivered', handleDelivery);

module.exports = { handleDelivery };
