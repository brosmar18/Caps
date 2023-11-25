'use strict';

const eventPool = require('./eventPool');
const startVendorProcess = require('./vendor');
require('./vendor');
require('./driver')

// Log events
const logEvent = (eventType, payload) => {
    const time = new Date().toISOString();
    console.log(`EVENT: { event: '${eventType}', time: '${time}', payload: ${JSON.stringify(payload, null, 2)} }`);
}

// Bind the logEvent function to multiple events
eventPool.on('picked-up', payload => logEvent('picked-up', payload));
eventPool.on('in-transit', payload => logEvent('in-transit', payload));
eventPool.on('delivered', payload => logEvent('delivered', payload));

