'use strict';

const Chance = require('chance');
const chance = new Chance();
const SocketClient = require('../../server/lib/SocketClient');
const storeName = '1-206-flowers';
require('dotenv').config();
const PORT = process.env.PORT || 5002;
const serverUrl = `http://localhost:${PORT}/caps`; 

function createOrder() {
    return {
        store: storeName,
        orderId: chance.guid(),
        customer: chance.name(),
        address: `${chance.city()}, ${chance.state({ full: true })}`
    };
}

function startFlowerStoreProcess() {
    const socketClient = new SocketClient(storeName, serverUrl);

    socketClient.subscribe('in-transit', (payload) => {
        console.log(`Flower Store: Order ID ${payload.orderId} is In-Transit`);
    });

    socketClient.subscribe('delivered', (payload) => {
        console.log(`Flower Store: Order ID ${payload.orderId} has been Delivered`);
        console.log(`Flower Store: Thank you for delivering order ID ${payload.orderId}`);
        socketClient.publish('received', { clientId: storeName, event: 'delivered', messageId: payload.orderId });
    });

    setInterval(() => {
        const order = createOrder();
        console.log(`Flower Store: New pickup request for order ID: ${order.orderId}`);
        socketClient.publish('pickup', order);
    }, 5000);
}

module.exports = { startFlowerStoreProcess };
