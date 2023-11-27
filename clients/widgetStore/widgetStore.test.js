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
  
  const { startWidgetStoreProcess } = require('./handler');
  const io = require('socket.io-client');
  
  describe('widgetStore handler', () => {
    let mockSocket;

    beforeEach(() => {
      io.mockClear();
      mockSocket = { emit: jest.fn(), on: jest.fn() };
      io.mockReturnValue(mockSocket);
      jest.spyOn(console, 'log'); 
      jest.useFakeTimers();
      startWidgetStoreProcess();
    });

    afterEach(() => {
      jest.restoreAllMocks();
      jest.useRealTimers();
    });

    it('should set up subscriptions and start emitting orders', () => {
      expect(mockSocket.on).toHaveBeenCalledWith('in-transit', expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith('delivered', expect.any(Function));
  
      jest.advanceTimersByTime(5000);
      expect(mockSocket.emit).toHaveBeenCalledWith('pickup', expect.objectContaining({ orderId: expect.any(String) }));
    });

    it('should log in-transit messages correctly', () => {
      const testPayload = { orderId: 'in-transit-order' };
      const inTransitCallback = mockSocket.on.mock.calls.find(call => call[0] === 'in-transit')[1];
      inTransitCallback(testPayload);
      expect(console.log).toHaveBeenCalledWith(`Widget Store: Order ID ${testPayload.orderId} is In-Transit`);
    });

    it('should log delivered messages and publish received event correctly', () => {
        const storeName = 'The Widget Store';
      const testPayload = { orderId: 'delivered-order' };
      const deliveredCallback = mockSocket.on.mock.calls.find(call => call[0] === 'delivered')[1];
      deliveredCallback(testPayload);
      expect(console.log).toHaveBeenCalledWith(`Widget Store: Order ID ${testPayload.orderId} has been Delivered`);
      expect(console.log).toHaveBeenCalledWith(`Widget Store: Thank you for delivering order ID ${testPayload.orderId}`);
      expect(mockSocket.emit).toHaveBeenCalledWith('received', { clientId: storeName, event: 'delivered', messageId: testPayload.orderId });
    });
  });
