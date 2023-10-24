'use strict'

const Grenache = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')

const Peer = Grenache.PeerRPCClient

const link = new Link({
  grape: 'http://127.0.0.1:30001'
})
link.start()

const peer = new Peer(link, {})
peer.init()

// Variables
const numClients = 3;

// Simulate an order payload
function createOrder(clientId) {
  const price = Math.floor(Math.random() * 10) + 1; // Random price between 1 and 10
  const quantity = Math.floor(Math.random() * 8) + 1; // Random quantity between 1 and 8
  const order = {
    clientId,
    price,
    quantity,
  };
  return {
    action: 'submitOrder',
    args: [order],
  };
}

// Simulate order submission from clients
for (let i = 1; i <= numClients; i++) {
  setInterval(() => {
    const clientId = `client${i}`;
    const orderPayload = createOrder(clientId);
    console.log('order payload', orderPayload.args);
    peer.map('exchange:service', orderPayload, { multicall: true }, (err, data) => {
      if (err) console.error(err);
      
      console.log('query response:');
      console.log(data);
      console.log('---');
    });
  }, 5000 * i); // Delay to submit orders at different times
}
