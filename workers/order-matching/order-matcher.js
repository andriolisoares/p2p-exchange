'use strict'
const async = require('async');

class OrderMatcher {
  /**
   * Matches orders between different clients and updates the client order
   * books accordingly.
   */
  static matchOrders(clientOrderBooks, clientId) {
    // Retrieving the order book for a specific client.
    const clientOrders = clientOrderBooks[clientId];

    if (!clientOrders) return;

    // Iterate over each order
    async.each(clientOrders, (order, callback) => {
      for (const otherClientId in clientOrderBooks) {
        if (otherClientId !== clientId) {
          const otherOrders = clientOrderBooks[otherClientId];

          for (let i = otherOrders.length - 1; i >= 0; i--) {
            if (order.price === otherOrders[i].price && order.quantity === otherOrders[i].quantity) {
              console.log(`Matched order: ${JSON.stringify(order)} with ${JSON.stringify(otherOrders[i])}`);

              /* Checking if the quantity of the current order matches the quantity
              of another order in the order book. If there is a match, it calculates the remainder
              quantity after subtracting the matched quantity from the current order's quantity. */
              const remainder = Math.abs(order.quantity - otherOrders[i].quantity);
              if (remainder > 0) {
                order.quantity = remainder;
                otherOrders.splice(i, 1);
              } else {
                otherOrders.splice(i, 1);
                order.quantity = 0;
              }
            }
          }
        }
      }
      callback();
    }, (err) => {
      if (err) console.error(err);
      clientOrderBooks[clientId] = clientOrders.filter(order => order.quantity > 0);
    });
    // console.log('Order Book', clientOrderBooks);
  }
}

module.exports = OrderMatcher;
