'use strict'

const { Api } = require('bfx-wrk-api');

class exchangeService extends Api {
  /**
   * Adds the order to the client's order book, sends the order to other nodes for matching and bookkeeping,
   * matches the orders locally, and returns an acknowledgement of order submission.
   */
  submitOrder(space, args, cb) {
    // Extract the clientId, price, and quantity properties from the args object
    const { clientId, price, quantity } = args;

    // Input validations
    if (!clientId) return cb(new Error('ERR_ARGS_NO_CLIENTID'));
    if (!price) return cb(new Error('ERR_ARGS_NO_PRICE'));
    if (!quantity) return cb(new Error('ERR_ARGS_NO_QUANTITY'));

    if (!this.ctx.clientOrderBooks[clientId]) {
      this.ctx.clientOrderBooks[clientId] = [];
    }
    this.ctx.clientOrderBooks[clientId].push({ price, quantity });

    // TODO - peer.getPeers() not working
    // const peer = this.ctx.grc_bfx.peer;
    // const excludeNodeIds = [this.ctx.grc_bfx.service.id]; // Node's own ID
    // const allNodeIds = peer.getPeers('exchange:service'); // Get all available node IDs for the 'exchange:service'

    // Remove node's own ID from the list
    // const nodeIdsToBroadcastTo = allNodeIds.filter(nodeId => !excludeNodeIds.includes(nodeId));

    // Broadcast the order to other nodes
    // const order = { action: 'submitOrder', args: [args] };
    // peer.map('exchange:service', order, { multicall: true, nodes: nodeIdsToBroadcastTo }, (err, data) => {
    //   if (err) console.error(err);
    //   console.log('send okay', data);
    // });

    /* Calling the order matcher function. */
    this.ctx.orderMatcherFn(this.ctx.clientOrderBooks, clientId);

    // Acknowledging order submission
    cb(null, 'Order received');
  }
}

module.exports = exchangeService;
