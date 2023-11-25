'use strict';

const { startOrderProcess, handleDelivery } = require('./handler');
const eventPool = require('../eventPool');

jest.mock('../eventPool', () => ({
  emit: jest.fn(),
  on: jest.fn()
}));

jest.useFakeTimers();

describe('Vendor Order Creation and Emission', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create and emit an order every 30 seconds', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    

    startOrderProcess();
  

    jest.advanceTimersByTime(32000); 
    

    expect(consoleSpy).toHaveBeenCalled();

    expect(eventPool.emit).toHaveBeenCalledWith('pickup', expect.any(Object));
  

    jest.clearAllMocks();
  

    jest.advanceTimersByTime(32000);
  

    expect(consoleSpy).toHaveBeenCalled();
    expect(eventPool.emit).toHaveBeenCalledWith('pickup', expect.any(Object));
  });
  

  it('should log a thank you message on delivery', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const mockPayload = { orderId: 'test-order-id' };


    handleDelivery(mockPayload);


    expect(consoleSpy).toHaveBeenCalledWith(`VENDOR: Thanks for delivering the order: ${mockPayload.orderId}`);
  });
});
