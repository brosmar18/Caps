jest.mock('socket.io-client', () => {
  return jest.fn().mockImplementation(() => {
    return {
      emit: jest.fn(),
      on: jest.fn(),
      connect: jest.fn(),
      disconnect: jest.fn(),
      close: jest.fn(),
    };
  });
});

const { startDriverProcess } = require('./handler');
const io = require('socket.io-client');

describe('Driver Event Handlers', () => {
  let mockSocket;

  beforeEach(() => {
    io.mockClear();
    mockSocket = { emit: jest.fn(), on: jest.fn() };
    io.mockReturnValue(mockSocket);
    jest.spyOn(console, 'log');
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('should handle pickup event and emit in-transit', () => {
    startDriverProcess();

    const testPayload = { orderId: 'test-order' };
    const pickupCallback = mockSocket.on.mock.calls.find(call => call[0] === 'pickup')[1];
    pickupCallback(testPayload);

    expect(console.log).toHaveBeenCalledWith(`DRIVER: Picked up order ID ${testPayload.orderId}`);
    expect(console.log).toHaveBeenCalledWith(`DRIVER: Order ID ${testPayload.orderId} is now In-Transit`);
    expect(mockSocket.emit).toHaveBeenCalledWith('in-transit', testPayload);

    jest.runAllTimers();
    expect(mockSocket.emit).toHaveBeenCalledWith('delivered', testPayload);
  });

  it('should handle delivered event', () => {
    startDriverProcess();


    const testPayload = { orderId: 'test-order' };
    const pickupCallback = mockSocket.on.mock.calls.find(call => call[0] === 'pickup')[1];
    pickupCallback(testPayload);


    jest.runAllTimers();


    expect(console.log).toHaveBeenCalledWith(`DRIVER: Delivered order ID ${testPayload.orderId}`);
    expect(mockSocket.emit).toHaveBeenCalledWith('delivered', testPayload);
  });

});
