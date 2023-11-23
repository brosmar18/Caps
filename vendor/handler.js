'use strict';

const Chance = require('chance');
const chance = new Chance();
const eventPool = require('../eventPool');

function createOrder(storeName) {
  return {
    store: storeName,
    orderId: chance.guid(),
    customer: chance.name(),
    address: `${chance.city()}, ${chance.state({ full: true })}`
  };
}


setInterval(() => {
  const order = createOrder('TheVendor'); 
  console.log('VENDOR: New pickup request', order);
  eventPool.emit('pickup', order);
}, 5000);

const handleDelivery = (payload) => {
  console.log(`VENDOR: Thanks for delivering the order: ${payload.orderId}`);
}

eventPool.on('delivered', handleDelivery);

module.exports = { handleDelivery };
