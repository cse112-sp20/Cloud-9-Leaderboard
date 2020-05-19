"use strict";
exports.__esModule = true;
exports.CacheManager = void 0;
var NodeCache = require("node-cache");
var CacheManager = /** @class */ (function () {
    function CacheManager() {
        // default cache of 2 minutes
        this.myCache = new NodeCache({ stdTTL: 120 });
    }
    CacheManager.getInstance = function () {
        if (!CacheManager.instance) {
            CacheManager.instance = new CacheManager();
        }
        return CacheManager.instance;
    };
    CacheManager.prototype.get = function (key) {
        return this.myCache.get(key);
    };
    CacheManager.prototype.set = function (key, value, ttl) {
        if (ttl === void 0) { ttl = -1; }
        if (ttl > 0) {
            this.myCache.set(key, value, ttl);
        }
        else {
            // use the standard cache ttl
            this.myCache.set(key, value);
        }
    };
    return CacheManager;
}());
exports.CacheManager = CacheManager;
