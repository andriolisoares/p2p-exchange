'use strict'

const { WrkApi } = require('bfx-wrk-api');
const OrderMatcher = require('./order-matching/order-matcher');

class WrkexchangeServiceApi extends WrkApi {

  constructor(conf, ctx) {
    super(conf, ctx);

    this.loadConf('service.exchange', 'exchange');

    this.init();
    this.start();
  }

  getPluginCtx(type) {
    const ctx = super.getPluginCtx(type)

    switch (type) {
      case 'api_bfx':
        // Set client order books
        ctx.clientOrderBooks = {};
        ctx.orderMatcherFn = OrderMatcher.matchOrders;
        this.setupOrderMatchingInterval(ctx);
        break
    }

    return ctx
  }

  init() {
    super.init();

    // contains all args passed to worker.js - also custom ones
    // console.log('context in worker: ', this.ctx);    
  }

  /**
   * Check and match orders in the order books for all clients. 
   * It ensures that the order matching process is performed at regular intervals 
   * for each client, allowing new orders to be matched and processed. 
   */
  setupOrderMatchingInterval(ctx) {
    setInterval(() => {
      for (const clientId in ctx.clientOrderBooks) {
        console.log('Matching for', clientId);
        OrderMatcher.matchOrders(ctx.clientOrderBooks, clientId);
      }
    }, 5000);
  }
  
}

module.exports = WrkexchangeServiceApi;
