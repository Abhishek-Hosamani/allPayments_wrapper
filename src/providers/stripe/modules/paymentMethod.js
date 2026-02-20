class PaymentMethodModule {
  constructor(stripe, handleError) {
    this._stripe = stripe;
    this._handleError = handleError;
  }

  /**
   * Attach a payment method to a customer
   * @param {string} paymentMethodId
   * @param {string} customerId
   */
  async attach(paymentMethodId, customerId) {
    try {
      return await this._stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
    } catch (err) {
      this._handleError(err, { method: 'paymentMethods.attach', paymentMethodId, customerId });
    }
  }

  /**
   * Detach a payment method from a customer
   * @param {string} paymentMethodId
   */
  async detach(paymentMethodId) {
    try {
      return await this._stripe.paymentMethods.detach(paymentMethodId);
    } catch (err) {
      this._handleError(err, { method: 'paymentMethods.detach', paymentMethodId });
    }
  }

  /**
   * Retrieve a payment method
   * @param {string} paymentMethodId
   */
  async retrieve(paymentMethodId) {
    try {
      return await this._stripe.paymentMethods.retrieve(paymentMethodId);
    } catch (err) {
      this._handleError(err, { method: 'paymentMethods.retrieve', paymentMethodId });
    }
  }

  /**
   * List payment methods for a customer
   * @param {string} customerId
   * @param {string} [type='card'] - card, us_bank_account, etc.
   */
  async list(customerId, type = 'card') {
    try {
      return await this._stripe.paymentMethods.list({ customer: customerId, type });
    } catch (err) {
      this._handleError(err, { method: 'paymentMethods.list', customerId, type });
    }
  }
}

module.exports = PaymentMethodModule;
