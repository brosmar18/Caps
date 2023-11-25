'use strict';

const { handlePickup, handleDelivered } = require('./handler');
const eventPool = require('../eventPool');


jest.mock('../eventPool', () => ({
  emit: jest.fn(),
  on: jest.fn()
}));

jest.useFakeTimers();

describe('Driver Event Handlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should emit in-transit and log pickup message on handlePickup', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const order = { orderId: '1234' };

    handlePickup(order);

    expect(consoleSpy).toHaveBeenCalledWith(`DRIVER: Picked up ${order.orderId}`);
    expect(eventPool.emit).toHaveBeenCalledWith('picked-up', order);

    
    jest.advanceTimersByTime(3000);

    
    expect(eventPool.emit).toHaveBeenCalledWith('delivered', order);
  });

  it('should emit delivered and log delivery message on handleDelivered', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const order = { orderId: '5678' };

    handleDelivered(order);

    expect(consoleSpy).toHaveBeenCalledWith(`DRIVER: Delivered ${order.orderId}`);
    expect(eventPool.emit).toHaveBeenCalledWith('delivered', order);
  });
});
