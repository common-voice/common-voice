class ClientLogger {
  name: string;

  constructor({ name }: { name: string }) {
    this.name = name ? `[${name}]` : '';
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log(...args: any[]) {
    console.log(this.name, ...args);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info(...args: any[]) {
    console.info(this.name, ...args);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(...args: any[]) {
    console.error(this.name, ...args);
  }
}

export default ClientLogger;
