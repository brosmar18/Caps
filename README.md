# LAB - Class 11

## Project: Caps

### Author: Bryan O. Garduno Gonzalez


### Problem Domain

The CAPS (Courier, Airline, Parcel, and Shipment) system is designed as an event-driven application simulating a package delivery process. It represents the interaction between vendors and drivers in the package delivery lifecycle using a Node.js-based system. The application employs an event-driven architecture to manage package states (pickup, in-transit, and delivered) and facilitate real-time communication between vendors and drivers.

### Links and Resources

- [GitHub Actions ci/cd]() 
- Dev [Back-end server Dev Branch url]()
- Main [back-end server main branch url]()


### Collaborators



- **ChatGPT by OpenAI**: Used as a programming partner for brainstorming ideas, debugging code, formulating tests, and drafting documentation. ChatGPT's contributions were invaluable in enhancing the efficiency and quality of the development process.


### Setup

#### `.env` requirements (where applicable)


A .env file is included in local repository. A .env-sample file is uploaed to the remote repo so collaborators understand what environmental variables are being used. 

#### How to initialize/run your application (where applicable)

- e.g. `npm start`

#### How to use your library (where applicable)

## Features

- **Event-Driven Architecture**: The CAPS system leverages an event-driven model to simulate real-time interactions in the package delivery lifecycle. This approach allows for efficient and dynamic communication between different modules of the application.

- **Global Event Pool**: Implemented through `eventPool.js`, this module acts as the central hub for all events, enabling different parts of the application to communicate via event emissions.

- **Vendor Client Application**: 
  - Automatic Order Generation: The vendor module, comprised of `vendor/handler.js` and `vendor/index.js`, simulates order creation at regular intervals using the Chance library to generate random order details.
  - Event Emission: Upon generating an order, a 'pickup' event is emitted to the Global Event Pool with detailed order information.
  - Delivery Acknowledgment: The vendor listens for 'delivered' events and logs a thank you message upon successful delivery.

- **Driver Client Application**: 
  - Order Processing: In `driver/handler.js`, the driver module listens for 'pickup' events. Upon receiving an order, it emits an 'in-transit' event, simulates a delivery process, and then emits a 'delivered' event.
  - Real-time Updates: The driver module logs updates at each stage of the delivery process, providing real-time feedback on the status of each order.

- **Robust Logging System**: Implemented in `hub.js`, the system logs all events with timestamps and payloads, offering transparency and traceability for all package movements within the system.

- **Unit Testing**: The application includes comprehensive unit tests for event handlers in both the vendor and driver modules, ensuring the reliability and integrity of the event handling logic.





#### Tests

The CAPS project includes a suite of unit tests to ensure the functionality and reliability of its event handlers and modules. The tests are divided into two main categories: Vendor Order Creation and Emission and Driver Event Handlers.

##### Vendor Order Creation and Emission
This set of tests focuses on the functionality related to vendors alerting the system when they have a package to be picked up and receiving a thank you message on delivery.

##### Driver Event Handlers
These tests concentrate on the functionality of drivers being notified about package delivery and handling pickup and delivery events.

### Running the Tests:

To run the tests for the CAPS project, use the following commands:

`npm test`

### Incomplete or Skipped Tests:

All critical functionality of the CAPS project is covered by these tests, and there are no incomplete or skipped tests. The test suite provides comprehensive coverage of the specified features and requirements.


#### UML


![Caps](assets/capsUML.png);
