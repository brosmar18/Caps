'use strict';

const { handlePickup, handleDelivered } = require('./handler');
const io = require('socket.io-client');

jest.mock('socket.io-client', () => {
  const emit = jest.fn();
  const on = jest.fn();

  // Mock implementation of io function
  const io = jest.fn().mockImplementation(() => ({
    emit,
    on,
    connect: jest.fn(),
    disconnect: jest.fn(),
    close: jest.fn(),
  }));

  return io;
});

jest.useFakeTimers();

describe('Driver Event Handlers', () => {
  let socket;
  beforeEach(() => {
    io.mockClear();
    socket = io();
  });


  it('should emit in-transit and log pickup message on handlePickup', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const order = { orderId: '1234' };

    handlePickup(order);

    // Advance timers for the setTimeout in handlePickup
    jest.runAllTimers();

    expect(consoleSpy).toHaveBeenCalledWith(`DRIVER: Picked up order ID ${order.orderId}`);
    expect(consoleSpy).toHaveBeenCalledWith(`DRIVER: Order ID ${order.orderId} is now In-Transit`);
    expect(socket.emit).toHaveBeenCalledWith('in-transit', order);

    // Additional check for the 'delivered' emit after the timeout
    expect(socket.emit).toHaveBeenCalledWith('delivered', order);
  });

  it('should emit delivered and log delivery message on handleDelivered', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const order = { orderId: '5678' };

    handleDelivered(order);

    expect(consoleSpy).toHaveBeenCalledWith(`DRIVER: Delivered order ID ${order.orderId}`);
    expect(socket.emit).toHaveBeenCalledWith('delivered', order);
  });

  it('should handle socket connect and pickup events', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const order = { orderId: 'connect-test' };

    // Manually trigger the 'connect' event
    const connectCallback = socket.on.mock.calls.find(call => call[0] === 'connect')[1];
    connectCallback();

    // Check if 'Driver connected to the CAPS server' is logged
    expect(consoleSpy).toHaveBeenCalledWith('Driver connected to the CAPS server');

    // Manually trigger the 'pickup' event
    const pickupCallback = socket.on.mock.calls.find(call => call[0] === 'pickup')[1];
    pickupCallback(order);

    // Verify that the pickup handler is called
    expect(consoleSpy).toHaveBeenCalledWith(`DRIVER: Picked up order ID ${order.orderId}`);
    expect(consoleSpy).toHaveBeenCalledWith(`DRIVER: Order ID ${order.orderId} is now In-Transit`);
    expect(socket.emit).toHaveBeenCalledWith('in-transit', order);
  });
});
