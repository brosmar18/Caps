'use strict';

const { Server } = require('socket.io');
require('dotenv').config();
const PORT = process.env.PORT || 5002;
const server = new Server();
const caps = server.of('/caps');
const Queue = require('./lib/queue');
const messageQueue = new Queue();

caps.on('connection', (socket) => {
    console.log(`Client Connected: ${socket.id}`);

    socket.on('join', (room) => {
        console.log(`Socket ${socket.id} joined room ${room}`);
        socket.join(room);
    });

    socket.on('pickup', (payload) => {
        messageQueue.addMessage('drivers', 'pickup', payload);
        console.log(`New Pickup Request Received: Order ID ${payload.orderId}`);
        socket.broadcast.emit('pickup', payload);
    });

    socket.on('in-transit', (payload) => {
        console.log(`Order In-Transit: Order ID ${payload.orderId}`);
        socket.to(payload.store).emit('in-transit', payload);
    });

    socket.on('delivered', (payload) => {
        messageQueue.addMessage(payload.vendorId, 'delivered', payload);
        console.log(`Order Delivered: Order ID ${payload.orderId}`);
        socket.to(payload.store).emit('delivered', payload);
    });

    socket.on('received', ({ clientId, event, messageId}) => {
        messageQueue.acknoledgeMessage(clientId, event, messageId);
    });

    socket.on('getAll', ({ clientId, event}) => {
        const messages = messageQueue.getMessages(clientId, event);
        messages.forEach((message) => {
            socket.emit(event, message);
        });
    });
});

server.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});