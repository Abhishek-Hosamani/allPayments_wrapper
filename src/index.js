const StripeProvider = require('./providers/stripe/index');

class AllPaymentsWrapper {
    constructor(config = {}) {
        this._providers = {};
        this._config = config;

        if (config.stripe) {
            this._providers.stripe = new StripeProvider(config.stripe);
        }
    }

    /**
     * Get a specific provider
     * @param {'stripe'} name
     */
    provider(name) {
        if (!this._providers[name]) {
            throw new Error(
                `Provider "${name}" is not configured. Pass it in the constructor config.`
            );
        }
        return this._providers[name];
    }

    get stripe() {
        return this.provider('stripe');
    }
}

module.exports = AllPaymentsWrapper;