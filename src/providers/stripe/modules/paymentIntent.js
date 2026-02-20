class PaymentIntentModule {
  constructor(stripe, handleError) {
    this._stripe = stripe;
    this._handleError = handleError;
  }

  /**
   * Create a PaymentIntent
   * @param {Object} params
   * @param {number} params.amount       - Amount in smallest currency unit (e.g. cents)
   * @param {string} params.currency     - ISO currency code e.g. 'usd'
   * @param {string} [params.customer]   - Stripe customer ID
   * @param {string[]} [params.payment_method_types]
   */
  async create(params = {}) {
    if (!params.amount) throw new Error('[AllPayments/Stripe] paymentIntents.create: amount is required.');
    if (!params.currency) throw new Error('[AllPayments/Stripe] paymentIntents.create: currency is required.');
    try {
      return await this._stripe.paymentIntents.create(params);
    } catch (err) {
      this._handleError(err, { method: 'paymentIntents.create', params });
    }
  }

  /**
   * Retrieve a PaymentIntent
   * @param {string} paymentIntentId
   */
  async retrieve(paymentIntentId) {
    try {
      return await this._stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (err) {
      this._handleError(err, { method: 'paymentIntents.retrieve', paymentIntentId });
    }
  }

  /**
   * Confirm a PaymentIntent
   * @param {string} paymentIntentId
   * @param {Object} [params]
   */
  async confirm(paymentIntentId, params = {}) {
    try {
      return await this._stripe.paymentIntents.confirm(paymentIntentId, params);
    } catch (err) {
      this._handleError(err, { method: 'paymentIntents.confirm', paymentIntentId, params });
    }
  }

  /**
   * Cancel a PaymentIntent
   * @param {string} paymentIntentId
   * @param {Object} [params]
   */
  async cancel(paymentIntentId, params = {}) {
    try {
      return await this._stripe.paymentIntents.cancel(paymentIntentId, params);
    } catch (err) {
      this._handleError(err, { method: 'paymentIntents.cancel', paymentIntentId, params });
    }
  }

  /**
   * Capture a PaymentIntent (for manual capture flow)
   * @param {string} paymentIntentId
   * @param {Object} [params]
   */
  async capture(paymentIntentId, params = {}) {
    try {
      return await this._stripe.paymentIntents.capture(paymentIntentId, params);
    } catch (err) {
      this._handleError(err, { method: 'paymentIntents.capture', paymentIntentId, params });
    }
  }

  /**
   * Update a PaymentIntent
   * @param {string} paymentIntentId
   * @param {Object} params
   */
  async update(paymentIntentId, params = {}) {
    try {
      return await this._stripe.paymentIntents.update(paymentIntentId, params);
    } catch (err) {
      this._handleError(err, { method: 'paymentIntents.update', paymentIntentId, params });
    }
  }

  /**
   * List PaymentIntents
   * @param {Object} [params]
   */
  async list(params = {}) {
    try {
      return await this._stripe.paymentIntents.list(params);
    } catch (err) {
      this._handleError(err, { method: 'paymentIntents.list', params });
    }
  }
}

module.exports = PaymentIntentModule;
