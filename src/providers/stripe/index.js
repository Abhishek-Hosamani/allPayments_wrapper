const Stripe = require('stripe');
const BaseProvider = require('../base');

const CustomerModule = require('./modules/customer');
const PaymentIntentModule = require('./modules/paymentIntent');
const SubscriptionModule = require('./modules/subscription');
const RefundModule = require('./modules/refund');
const WebhookModule = require('./modules/webhook');
const PaymentMethodModule = require('./modules/paymentMethod');

class StripeProvider extends BaseProvider {
    /**
     * @param {Object} config
     * @param {string} config.secretKey         - Stripe secret key (required)
     * @param {string} [config.webhookSecret]   - Stripe webhook signing secret
     * @param {Object} [config.stripeOptions]   - Raw options forwarded to the Stripe constructor
     * @param {Function} [config.onError]       - Global error hook (err, context) => void
     */
    constructor(config) {
        super(config);

        if (!config.secretKey) {
            throw new Error('[AllPayments/Stripe] config.secretKey is required.');
        }

        this._stripe = new Stripe(config.secretKey, {
            apiVersion: '2023-10-16',
            ...(config.stripeOptions || {}),
        });

        this._onError = config.onError || null;

        // Attach modules
        this.customers = new CustomerModule(this._stripe, this._handleError.bind(this));
        this.paymentIntents = new PaymentIntentModule(this._stripe, this._handleError.bind(this));
        this.subscriptions = new SubscriptionModule(this._stripe, this._handleError.bind(this));
        this.refunds = new RefundModule(this._stripe, this._handleError.bind(this));
        this.paymentMethods = new PaymentMethodModule(this._stripe, this._handleError.bind(this));
        this.webhooks = new WebhookModule(this._stripe, config.webhookSecret, this._handleError.bind(this));
    }

    /**
     * Centralised error handler — calls user-supplied hook then re-throws
     */
    _handleError(err, context) {
        if (this._onError) {
            try { this._onError(err, context); } catch (_) { /* swallow hook errors */ }
        }
        throw err;
    }

    /**
     * Expose the raw Stripe client for escape-hatch access
     */
    get raw() {
        return this._stripe;
    }
}

module.exports = StripeProvider;