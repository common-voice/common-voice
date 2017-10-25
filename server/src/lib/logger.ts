import * as os from 'os';
import { CommonVoiceConfig } from '../config-helper';

const RandomName = require('node-random-name');

const NAME = 'voice';
const LEVEL_LOG = 'log';
const LEVEL_ERROR = 'error';

interface MessageFields {
  name: string;
  nickname: string;
  level: string;
  hostname: string;
  pid: number;
  msg: string;
  time: string;
  version: number;
}

export default class Logger {
  config: CommonVoiceConfig;
  name: string;
  nickname: string;
  hostname: string;
  pid: number;
  boundLog: Function;
  boundError: Function;

  constructor(config: CommonVoiceConfig) {
    this.config = config;
    this.name = NAME;
    this.nickname = RandomName({ last: true });
    this.hostname = os.hostname();
    this.pid = process.pid;
    this.boundLog = null;
    this.boundError = null;
  }

  private getDateString() {
    return new Date().toISOString();
  }

  private getMessageFields(level: string, msg: string): MessageFields {
    return {
      msg: msg,
      name: this.name,
      nickname: this.nickname,
      level: level,
      hostname: this.hostname,
      pid: this.pid,
      time: this.getDateString(),
      version: this.config.VERSION,
    };
  }

  private printFields(fields: MessageFields) {
    if (!this.boundLog) {
      console.error('unable to print without overriding console');
      return;
    }

    let output = JSON.stringify(fields);
    if (fields.level === LEVEL_LOG) {
      this.boundLog(output);
    } else if (fields.level === LEVEL_ERROR) {
      this.boundError(output);
    }
  }

  /**
   * This function will log the first couple of minutes to make sure
   * we are getting logs in production when our server first boots up.
   */
  private initiateHeartbeat() {
    let count = 0;
    const start = Date.now();
    const timer = setInterval(() => {
      console.log(`LOGGER - heartbeat ${++count}, ${Date.now() - start}`);
      if (count > 100) {
        clearInterval(timer);
      }
    }, 1000);
  }

  log(...args: any[]) {
    this.printFields(this.getMessageFields(LEVEL_LOG, args.join(', ')));
  }

  error(...args: any[]) {
    this.printFields(this.getMessageFields(LEVEL_ERROR, args.join(', ')));
  }

  overrideConsole() {
    if (this.boundLog) {
      this.error('already overrode console');
      return;
    }

    // Override console.log to user our json logger.
    this.boundLog = console.log.bind(console);
    console.log = (...args: any[]) => {
      this.log(...args);
    };

    // Override console.error to user our json logger.
    this.boundError = console.error.bind(console);
    console.error = (...args: any[]) => {
      this.error(...args);
    };

    this.initiateHeartbeat();
  }
}
