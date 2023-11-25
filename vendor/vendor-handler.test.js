jest.mock('socket.io-client', () => {
  const emit = jest.fn();
  const on = jest.fn((event, callback) => {
    if (event === 'connect') {
      
      callback();
    }
  });

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

// Mock dotenv
jest.mock('dotenv', () => ({
  config: jest.fn(),
}));


const { createOrder, startVendorProcess } = require('./handler');
const io = require('socket.io-client');

describe('Vendor Client Application', () => {
  beforeEach(() => {
    // Reset the mock for each test
    io.mockClear();
  });

  it('should create an order correctly', () => {
    const order = createOrder('1-206-flowers');
    expect(order).toHaveProperty('store', '1-206-flowers');
    expect(order).toHaveProperty('orderId');
    expect(order).toHaveProperty('customer');
    expect(order).toHaveProperty('address');
  });

  it('should start vendor process and handle socket events', () => {
    jest.useFakeTimers();

    // Start the vendor process with the mocked socket
    startVendorProcess();

    // Test initial emit
    expect(io().emit).toHaveBeenCalledWith('join', '1-206-flowers');

    // Fast forward the setInterval
    jest.advanceTimersByTime(5000);
    expect(io().emit).toHaveBeenCalledWith('pickup', expect.any(Object));

    // Advance timer and test repeated emit
    jest.advanceTimersByTime(5000);
    expect(io().emit).toHaveBeenCalledTimes(3);

    // Simulate 'in-transit' and 'delivered' events
    const inTransitCallback = io().on.mock.calls.find(call => call[0] === 'in-transit')[1];
    const deliveredCallback = io().on.mock.calls.find(call => call[0] === 'delivered')[1];

    const fakePayload = { orderId: 'test-order-id' };
    inTransitCallback(fakePayload);
    deliveredCallback(fakePayload);



    // Clean up
    jest.useRealTimers();
  });
});
