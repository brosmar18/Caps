'use strict';

const eventPool = require('../eventPool');

// Pickup event 
function handlePickup(payload) {
  console.log(`DRIVER: Picked up ${payload.orderId}`);
  eventPool.emit('in-transit', payload);

  // In-transit phase
  setTimeout(() => {
    handleDelivered(payload); 
  }, 3000); 
}

// Delivered event
function handleDelivered(payload) {
  console.log(`DRIVER: Delivered ${payload.orderId}`);
  eventPool.emit('delivered', payload);
}

eventPool.on('pickup', handlePickup);

module.exports = {
  handlePickup,
  handleDelivered
};
