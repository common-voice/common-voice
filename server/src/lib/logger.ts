const os = require('os');

const NAME = 'voice';
const LEVEL_LOG = 'log';
const LEVEL_ERROR = 'error';

interface MessageFields {
  name: string;
  level: string;
  hostname: string;
  pid: number;
  msg: string;
  time: string;
}

export default class Logger {
  name: string;
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
    return new Date().toISOString()
  }

  private getMessageFields(level: string, msg: string): MessageFields {
    return {
      name: this.name,
      level: level,
      hostname: this.hostname,
      pid: this.pid,
      msg: msg,
      time: this.getDateString()
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

  log(...args) {
    this.printFields(this.getMessageFields(LEVEL_LOG, args.join(', ')));
  }

  error(...args) {
    this.printFields(this.getMessageFields(LEVEL_ERROR, args.join(', ')));
  }

  overrideConsole() {
    if (this.boundLog) {
      this.error('already overrode console');
      return;
    }

    // Override console.log to user our json logger.
    this.boundLog = console.log.bind(console);
    console.log = (...args) => {
      this.log(...args);
    }

    // Override console.error to user our json logger.
    this.boundError = console.error.bind(console);
    console.error = (...args) => {
      this.error(...args);
    }
  }
}
