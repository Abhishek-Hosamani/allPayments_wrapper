class WebhookModule {
  constructor(stripe, webhookSecret, handleError) {
    this._stripe = stripe;
    this._webhookSecret = webhookSecret || null;
    this._handleError = handleError;
  }

  /**
   * Construct and verify an incoming Stripe webhook event.
   * Use this in your HTTP handler BEFORE parsing the body as JSON.
   *
   * @param {Buffer|string} rawBody   - The raw request body (NOT parsed)
   * @param {string}        signature - Value of the `Stripe-Signature` header
   * @returns {import('stripe').Stripe.Event}
   *
   * @example
   * // Express — use express.raw() middleware on this route
   * app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
   *   const event = payments.stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature']);
   *   // handle event...
   *   res.sendStatus(200);
   * });
   */
  constructEvent(rawBody, signature) {
    if (!this._webhookSecret) {
      throw new Error(
        '[AllPayments/Stripe] webhooks.constructEvent: webhookSecret is not configured. ' +
        'Pass config.stripe.webhookSecret when initialising AllPaymentsWrapper.'
      );
    }
    try {
      return this._stripe.webhooks.constructEvent(rawBody, signature, this._webhookSecret);
    } catch (err) {
      this._handleError(err, { method: 'webhooks.constructEvent' });
    }
  }
}

module.exports = WebhookModule;
