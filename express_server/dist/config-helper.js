"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Definition for all common voice config options.
 */
const fs = require("fs");
const DEFAULTS = {
    VERSION: null,
    RELEASE_VERSION: null,
    PROD: false,
    SERVER_PORT: 9000,
    DB_ROOT_USER: 'root',
    DB_ROOT_PASS: '',
    MYSQLUSER: 'voicecommons',
    MYSQLPASS: 'voicecommons',
    MYSQLDBNAME: 'voiceweb',
    MYSQLHOST: 'localhost',
    MYSQLPORT: 3306,
    BUCKET_NAME: 'common-voice-corpus',
    BUCKET_LOCATION: '',
    ENVIRONMENT: 'default',
    ENABLE_MIGRATIONS: false,
};
/**
 * Create our configuration by merging config.json and our DEFAULTS.
 */
function getConfig() {
    const localConfig = load();
    return Object.assign(DEFAULTS, localConfig);
}
exports.getConfig = getConfig;
/**
 * Attempt to load a json file, but return null if not found.
 */
function load() {
    let config = null;
    try {
        config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
    }
    catch (err) {
        console.log('could not load config.json, using defaults');
    }
    return config;
}
//# sourceMappingURL=config-helper.js.map