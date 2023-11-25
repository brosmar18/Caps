'use strict';

const eventPool = require('../eventPool');

// Pickup event 
function handlePickup(payload) {
  setTimeout(() => {
    console.log(`DRIVER: Picked up ${payload.orderId}`);
    eventPool.emit('picked-up', payload);
  }, 3000); // Delay before 'Picked up'


  // In-transit phase
  setTimeout(() => {
    console.log(`DRIVER: In-transit ${payload.orderId}`);
    handleDelivered(payload); 
  }, 10000); // Delay before 'In-transit'
}

// Delivered event
function handleDelivered(payload) {
  setTimeout(() => {
    console.log(`DRIVER: Delivered ${payload.orderId}`);
    eventPool.emit('delivered', payload);
  }, 5000); // Delay before 'Delivered'
}
eventPool.on('pickup', handlePickup);

module.exports = {
  handlePickup,
  handleDelivered
};
