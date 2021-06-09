import * as fs from 'fs';
import { S3, SSM } from 'aws-sdk';
import { config } from 'dotenv';

if (process.env.DOTENV_CONFIG_PATH) {
  const result = config({ path: process.env.DOTENV_CONFIG_PATH });
  if (result.error) {
    console.log(result.error);
    console.log('Failed loading dotenv file, using defaults');
  }
}

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
  MYSQLREPLICAHOST?: string;
  MYSQLPORT: number;
  MYSQLREPLICAPORT?: number;
  CLIP_BUCKET_NAME: string;
  DATASET_BUCKET_NAME: string;
  BUCKET_LOCATION: string;
  ENVIRONMENT: string;
  RELEASE_VERSION?: string;
  SECRET: string;
  S3_CONFIG: S3.Types.ClientConfiguration;
  CINCHY_CONFIG: S3.Types.ClientConfiguration;
  CINCHY_ENABLED: boolean;
  SSM_ENABLED: boolean;
  SSM_CONFIG: SSM.Types.ClientConfiguration;
  ADMIN_EMAILS: string;
  AUTH0: {
    DOMAIN: string;
    CLIENT_ID: string;
    CLIENT_SECRET: string;
  };
  BASKET_API_KEY?: string;
  IMPORT_SENTENCES: boolean;
  REDIS_URL: string;
  KIBANA_URL: string;
  KIBANA_PREFIX: string;
  KIBANA_ADMINS: string;
  LAST_DATASET: string;
  SENTRY_DSN: string;
  MAINTENANCE_MODE: boolean;
  BENCHMARK_LIVE: boolean;
  FLAG_BUFFER_STREAM_ENABLED: boolean;
};

const castDefault = (value: string): any => value;
const castBoolean = (value: string): boolean => value === 'true';
const castInt = (value: string): number => parseInt(value);
const castJson = (value: string): object => JSON.parse(value);
const configEntry = (key: string, defaultValue: any, cast = castDefault) =>
  process.env[key] ? cast(process.env[key]) : defaultValue;

const BASE_CONFIG: CommonVoiceConfig = {
  VERSION: configEntry('CV_VERSION', null), // Migration number (e.g. 20171205171637), null = most recent
  RELEASE_VERSION: configEntry('GIT_COMMIT_SHA', null), // X-Release-Version header
  PROD: configEntry('CV_PROD', false, castBoolean), // Set to true for staging and production.
  SERVER_PORT: configEntry('CV_SERVER_PORT', 9000, castInt),
  DB_ROOT_USER: configEntry('CV_DB_ROOT_USER', 'root'), // For running schema migrations.
  DB_ROOT_PASS: configEntry('CV_DB_ROOT_PASS', ''),
  MYSQLUSER: configEntry('CV_MYSQLUSER', 'voicecommons'), // For normal DB interactions.
  MYSQLPASS: configEntry('CV_MYSQLPASS', 'voicecommons'),
  MYSQLDBNAME: configEntry('CV_MYSQLDBNAME', 'voiceweb'),
  MYSQLHOST: configEntry('CV_MYSQLHOST', 'localhost'),
  MYSQLPORT: configEntry('CV_MYSQLPORT', 3306, castInt),
  MYSQLREPLICAHOST: configEntry('CV_MYSQLREPLICAHOST', ''),
  MYSQLREPLICAPORT: configEntry('CV_MYSQLREPLICAPORT', 3306, castInt),
  CLIP_BUCKET_NAME: configEntry('CV_CLIP_BUCKET_NAME', 'common-voice-clips'),
  DATASET_BUCKET_NAME: configEntry(
    'CV_DATASET_BUCKET_NAME',
    'common-voice-datasets'
  ),
  BUCKET_LOCATION: configEntry('CV_BUCKET_LOCATION', 'us-west-2'),
  ENVIRONMENT: configEntry('CV_ENVIRONMENT', 'default'),
  SECRET: configEntry('CV_SECRET', 'super-secure-secret'),
  ADMIN_EMAILS: configEntry('CV_ADMIN_EMAILS', null),
  S3_CONFIG: configEntry('CV_S3_CONFIG', {}, castJson),
  CINCHY_CONFIG: configEntry('CV_CINCHY_CONFIG', {}, castJson),
  CINCHY_ENABLED: configEntry('CV_CINCHY_ENABLED', false, castBoolean),
  SSM_ENABLED: configEntry('CV_SSM_ENABLED', false, castBoolean),
  SSM_CONFIG: configEntry('CV_SSM_CONFIG', {}, castJson),
  AUTH0: {
    DOMAIN: configEntry('CV_AUTH0_DOMAIN', ''),
    CLIENT_ID: configEntry('CV_AUTH0_CLIENT_ID', ''),
    CLIENT_SECRET: configEntry('CV_AUTH0_CLIENT_SECRET', ''),
  },
  IMPORT_SENTENCES: configEntry('CV_IMPORT_SENTENCES', true, castBoolean),
  REDIS_URL: configEntry('CV_REDIS_URL', null),
  KIBANA_URL: configEntry('CV_KIBANA_URL', null),
  KIBANA_PREFIX: configEntry('CV_KIBANA_PREFIX', '/_plugin/kibana'),
  KIBANA_ADMINS: configEntry('CV_KIBANA_ADMINS', null),
  LAST_DATASET: configEntry('CV_LAST_DATASET', '2019-06-12'),
  SENTRY_DSN: configEntry('CV_SENTRY_DSN', ''),
  MAINTENANCE_MODE: configEntry('CV_MAINTENANCE_MODE', false, castBoolean),
  BASKET_API_KEY: configEntry('CV_BASKET_API_KEY', null),
  BENCHMARK_LIVE: configEntry('CV_BENCHMARK_LIVE', false, castBoolean),
  FLAG_BUFFER_STREAM_ENABLED: configEntry('CV_FLAG_BUFFER_STREAM_ENABLED', false, castBoolean),
};

let injectedConfig: CommonVoiceConfig;
let loadedConfig: CommonVoiceConfig;

const ssm = new SSM(BASE_CONFIG.SSM_CONFIG);

async function getSecret(key: string) {
  const path = `/voice/${BASE_CONFIG.ENVIRONMENT}/${key}`;
  const params = {
    Name: path,
    WithDecryption: true,
  };
  const secret = await ssm.getParameter(params).promise();

  return secret.Parameter.Value;
}

let loadedSecrets: Partial<CommonVoiceConfig>;

export async function getSecrets(): Promise<Partial<CommonVoiceConfig>> {
  if (loadedSecrets) {
    console.log('Use pre-loaded secrets');
    return loadedSecrets;
  }

  loadedSecrets = {};

  if (BASE_CONFIG.SSM_ENABLED) {
    console.log('Fetch SSM secrets.');
    loadedSecrets = {
      MYSQLPASS: await getSecret('mysql-user-pw'),
      DB_ROOT_PASS: await getSecret('mysql-root-pw'),
      MYSQLHOST: await getSecret('mysql-host'),
      SECRET: await getSecret('app-secret'),
      BASKET_API_KEY: await getSecret('basket-api-key'),
      AUTH0: {
        DOMAIN: await getSecret('auth0-domain'),
        CLIENT_ID: await getSecret('auth0-client-id'),
        CLIENT_SECRET: await getSecret('auth0-client-secret'),
      },
    };
  }
  return loadedSecrets;
}

export function injectConfig(config: any) {
  injectedConfig = { ...BASE_CONFIG, ...config };
}

export function getConfig(): CommonVoiceConfig {
  if (injectedConfig) {
    return injectedConfig;
  }

  if (loadedConfig) {
    return loadedConfig;
  }

  let fileConfig = null;

  try {
    let config_path = process.env.SERVER_CONFIG_PATH || './config.json';
    fileConfig = JSON.parse(fs.readFileSync(config_path, 'utf-8'));
  } catch (err) {
    console.error(
      `Could not load config.json, using defaults (error message: ${err.message})`
    );
  }
  loadedConfig = { ...BASE_CONFIG, ...loadedSecrets, ...fileConfig };

  return loadedConfig;
}
