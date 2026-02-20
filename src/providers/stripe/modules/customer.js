class CustomerModule {
  constructor(stripe, handleError) {
    this._stripe = stripe;
    this._handleError = handleError;
  }

  /**
   * Create a customer
   * @param {Object} params  - https://stripe.com/docs/api/customers/create
   */
  async create(params = {}) {
    try {
      return await this._stripe.customers.create(params);
    } catch (err) {
      this._handleError(err, { method: 'customers.create', params });
    }
  }

  /**
   * Retrieve a customer by ID
   * @param {string} customerId
   */
  async retrieve(customerId) {
    try {
      return await this._stripe.customers.retrieve(customerId);
    } catch (err) {
      this._handleError(err, { method: 'customers.retrieve', customerId });
    }
  }

  /**
   * Update a customer
   * @param {string} customerId
   * @param {Object} params
   */
  async update(customerId, params = {}) {
    try {
      return await this._stripe.customers.update(customerId, params);
    } catch (err) {
      this._handleError(err, { method: 'customers.update', customerId, params });
    }
  }

  /**
   * Delete a customer
   * @param {string} customerId
   */
  async delete(customerId) {
    try {
      return await this._stripe.customers.del(customerId);
    } catch (err) {
      this._handleError(err, { method: 'customers.delete', customerId });
    }
  }

  /**
   * List customers
   * @param {Object} params - limit, email, starting_after, etc.
   */
  async list(params = {}) {
    try {
      return await this._stripe.customers.list(params);
    } catch (err) {
      this._handleError(err, { method: 'customers.list', params });
    }
  }
}

module.exports = CustomerModule;
