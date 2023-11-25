;'use strict';



const { Server } = require('socket.io');

require('dotenv').config();
const PORT = process.env.PORT || 5002;

const server = new Server();

const caps = server.of('/caps');

caps.on('connection', (socket) => {
    console.log(`Client Connected: ${socket.id}`);

    socket.on('join', (room) => {
        console.log(`Socket ${socket.id} joining ${room}`);
        socket.join(room);
    });

    socket.on('pickup', (payload) => {
        console.log('Event:', { event: 'pickup', payload });
        socket.broadcast.emit('pickup', payload); // Broadcast to all clients except sender
      });
    
      socket.on('in-transit', (payload) => {
        socket.to(payload.vendorId).emit('in-transit', payload); // Emit to specific vendor room
      });
    
      socket.on('delivered', (payload) => {
        socket.to(payload.vendorId).emit('delivered', payload); // Emit to specific vendor room
      });
});

server.listen(PORT);