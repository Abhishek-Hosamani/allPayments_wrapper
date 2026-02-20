class BaseProvider {
    constructor(config) {
        if (!config) throw new Error('Provider config is required.');
        this._config = config;
    }

    _notImplemented(method) {
        throw new Error(`Method "${method}" is not implemented by this provider.`);
    }
}

module.exports = BaseProvider;