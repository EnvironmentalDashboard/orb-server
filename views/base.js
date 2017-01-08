let base = {
    caughtAuthError: function(cache) {
        return cache.get('auth-error') !== undefined;
    }
};

module.exports = base;
