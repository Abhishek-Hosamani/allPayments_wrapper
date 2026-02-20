class SubscriptionModule {
  constructor(stripe, handleError) {
    this._stripe = stripe;
    this._handleError = handleError;
  }

  /**
   * Create a subscription
   * @param {Object} params
   * @param {string} params.customer  - Stripe customer ID (required)
   * @param {Array}  params.items     - [{ price: 'price_xxx' }] (required)
   */
  async create(params = {}) {
    if (!params.customer) throw new Error('[AllPayments/Stripe] subscriptions.create: customer is required.');
    if (!params.items || !params.items.length) throw new Error('[AllPayments/Stripe] subscriptions.create: items[] is required.');
    try {
      return await this._stripe.subscriptions.create(params);
    } catch (err) {
      this._handleError(err, { method: 'subscriptions.create', params });
    }
  }

  /**
   * Retrieve a subscription
   * @param {string} subscriptionId
   */
  async retrieve(subscriptionId) {
    try {
      return await this._stripe.subscriptions.retrieve(subscriptionId);
    } catch (err) {
      this._handleError(err, { method: 'subscriptions.retrieve', subscriptionId });
    }
  }

  /**
   * Update a subscription
   * @param {string} subscriptionId
   * @param {Object} params
   */
  async update(subscriptionId, params = {}) {
    try {
      return await this._stripe.subscriptions.update(subscriptionId, params);
    } catch (err) {
      this._handleError(err, { method: 'subscriptions.update', subscriptionId, params });
    }
  }

  /**
   * Cancel a subscription
   * @param {string} subscriptionId
   * @param {Object} [params] - e.g. { cancel_at_period_end: true }
   */
  async cancel(subscriptionId, params = {}) {
    try {
      // If cancel_at_period_end is requested, use update instead of cancel
      if (params.cancel_at_period_end) {
        return await this._stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true });
      }
      return await this._stripe.subscriptions.cancel(subscriptionId);
    } catch (err) {
      this._handleError(err, { method: 'subscriptions.cancel', subscriptionId, params });
    }
  }

  /**
   * List subscriptions
   * @param {Object} [params] - customer, status, limit, etc.
   */
  async list(params = {}) {
    try {
      return await this._stripe.subscriptions.list(params);
    } catch (err) {
      this._handleError(err, { method: 'subscriptions.list', params });
    }
  }
}

module.exports = SubscriptionModule;
