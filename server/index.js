'use strict';

const { Server } = require('socket.io');
require('dotenv').config();
const PORT = process.env.PORT || 5002;
const server = new Server();
const caps = server.of('/caps');

caps.on('connection', (socket) => {
    console.log(`Client Connected: ${socket.id}`);

    socket.on('join', (room) => {
        console.log(`Socket ${socket.id} joined room ${room}`);
        socket.join(room);
    });

    socket.on('pickup', (payload) => {
        console.log(`New Pickup Request Received: Order ID ${payload.orderId}`);
        socket.broadcast.emit('pickup', payload);
    });

    socket.on('in-transit', (payload) => {
        console.log(`Order In-Transit: Order ID ${payload.orderId}`);
        socket.to(payload.store).emit('in-transit', payload);
    });

    socket.on('delivered', (payload) => {
        console.log(`Order Delivered: Order ID ${payload.orderId}`);
        socket.to(payload.store).emit('delivered', payload);
    });
});

server.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});