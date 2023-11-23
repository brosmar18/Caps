'use strict';

const { handleDelivery } = require('./handler');
const eventPool = require('../eventPool');


jest.mock('../eventPool', () => ({
  on: jest.fn(),
  emit: jest.fn()
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Vendor Event Handlers', () => {
  it('should log a thank you message on delivery', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const order = { orderId: '1234' };

    handleDelivery(order);

    expect(consoleSpy).toHaveBeenCalledWith(`VENDOR: Thanks for delivering the order: ${order.orderId}`);
  });

});

