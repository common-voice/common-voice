const LOCAL_CONFIG_PATH = '../../config.json';

/**
 * Definition for all common voice config options.
 */
export type CommonVoiceConfig = {
  PROD: boolean;
  SERVER_PORT: number;
  DB_ROOT_USER: string;
  DB_ROOT_PASS: string;
  MYSQLUSER: string;
  MYSQLPASS: string;
  MYSQLDBNAME: string;
  MYSQLHOST: string;
  MYSQLPORT: number;
  BUCKET_NAME: string;
  BUCKET_LOCATION: string;
  ENVIRONMENT: string;
};

const DEFAULTS: CommonVoiceConfig = {
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
};

/**
 * Create our configuration by merging config.json and local.config.json.
 */
export function getConfig(): CommonVoiceConfig {
  const localConfig = load(LOCAL_CONFIG_PATH);
  return Object.assign(DEFAULTS, localConfig);
}

/**
 * Attempt to load a json file, but return null if not found.
 */
function load(path: string): CommonVoiceConfig {
  let config = null;
  try {
    config = require(path);
  } catch (err) {}
  return config;
}
