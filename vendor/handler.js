'use strict';

const eventPool = require('../eventPool');

const handleDelivery = (payload) => {
    console.log(`VENDOR: Thanks for delivering the order: ${payload.orderId}`);
}

eventPool.on('delivered', handleDelivery);

module.exports = { handleDelivery };