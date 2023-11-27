'use strict';

const Chance = require('chance');
const chance = new Chance();
const SocketClient = require('../../server/lib/SocketClient');
const storeName = 'The Widget Store';
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

function startWidgetStoreProcess() {
    const socketClient = new SocketClient(storeName, serverUrl);

    socketClient.subscribe('in-transit', (payload) => {
        console.log(`Widget Store: Order ID ${payload.orderId} is In-Transit`);
    });

    socketClient.subscribe('delivered', (payload) => {
        console.log(`Widget Store: Order ID ${payload.orderId} has been Delivered`);
        console.log(`Widget Store: Thank you for delivering order ID ${payload.orderId}`);
        socketClient.publish('received', { clientId: storeName, event: 'delivered', messageId: payload.orderId });
    });

    setInterval(() => {
        const order = createOrder();
        console.log(`Widget Store: New pickup request for order ID ${order.orderId}`);
        socketClient.publish('pickup', order);
    }, 5000);
}

module.exports = { startWidgetStoreProcess };
