class RefundModule {
  constructor(stripe, handleError) {
    this._stripe = stripe;
    this._handleError = handleError;
  }

  /**
   * Create a refund
   * @param {Object} params
   * @param {string} [params.payment_intent] - PaymentIntent ID (recommended)
   * @param {string} [params.charge]         - Charge ID
   * @param {number} [params.amount]         - Partial refund amount in smallest unit
   * @param {string} [params.reason]         - duplicate | fraudulent | requested_by_customer
   */
  async create(params = {}) {
    if (!params.payment_intent && !params.charge) {
      throw new Error('[AllPayments/Stripe] refunds.create: payment_intent or charge is required.');
    }
    try {
      return await this._stripe.refunds.create(params);
    } catch (err) {
      this._handleError(err, { method: 'refunds.create', params });
    }
  }

  /**
   * Retrieve a refund
   * @param {string} refundId
   */
  async retrieve(refundId) {
    try {
      return await this._stripe.refunds.retrieve(refundId);
    } catch (err) {
      this._handleError(err, { method: 'refunds.retrieve', refundId });
    }
  }

  /**
   * List refunds
   * @param {Object} [params]
   */
  async list(params = {}) {
    try {
      return await this._stripe.refunds.list(params);
    } catch (err) {
      this._handleError(err, { method: 'refunds.list', params });
    }
  }
}

module.exports = RefundModule;
