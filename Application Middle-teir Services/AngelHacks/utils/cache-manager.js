'use strict';

/** @module utils/log-manager.js
 * This is the local caching on the server side.
 */

/** Modules import */
var cacheManager = require('cache-manager');

/** Global Vars */
var memoryCache = cacheManager.caching({ store: 'memory', max: 1000000000000, ttl: 2 * 60/*seconds*/, ignoreCacheErrors: true});

module.exports = memoryCache;