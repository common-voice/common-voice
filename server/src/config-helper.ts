/**
 * Definition for all common voice config options.
 */
import * as fs from 'fs';

export type CommonVoiceConfig = {
  VERSION: string;
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
  ENABLE_MIGRATIONS: boolean;
  RELEASE_VERSION?: string;
};

const DEFAULTS: CommonVoiceConfig = {
  VERSION: null, // Migration number (e.g. 20171205171637), null = most recent
  RELEASE_VERSION: null, // release version set by nubis,
  PROD: false, // Set to true for staging and production.
  SERVER_PORT: 9000,
  DB_ROOT_USER: 'root', // For running schema migrations.
  DB_ROOT_PASS: '',
  MYSQLUSER: 'voicecommons', // For normal DB interactions.
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
export function getConfig(): CommonVoiceConfig {
  const localConfig = load();
  return Object.assign(DEFAULTS, localConfig);
}

/**
 * Attempt to load a json file, but return null if not found.
 */
function load(): CommonVoiceConfig {
  let config = null;
  try {
    config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
  } catch (err) {
    console.log('could not load config.json, using defaults');
  }
  return config;
}
