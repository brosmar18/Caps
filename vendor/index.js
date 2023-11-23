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

  module.exports = (storeName) => {
    setInterval(() => {
      const order = createOrder(storeName);
      console.log('VENDOR: New pickup request', order);
      eventPool.emit('pickup', order);
    }, 5000);
  };
  