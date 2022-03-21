import * as os from 'os';
import { getConfig } from '../config-helper';

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
  release_version?: string;
}

export default class Logger {
  name: string;
  nickname: string;
  hostname: string;
  pid: number;
  boundLog: Function;
  boundError: Function;

  constructor() {
    this.name = NAME;
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
      release_version: getConfig().RELEASE_VERSION,
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
  }
}
