import Server from './server';

const commands: any = {
  test() {
    require('./test/schema-migration');
    require('./test/user-test');
  },
};

const [, , commandName] = process.argv;

if (!commandName) {
  new Server().run();
} else {
  const command: any = commands[commandName];

  if (!command) {
    console.log(
      'Unknown command:',
      commandName,
      '. Valid commands are:',
      Object.keys(commands)
        .map(c => `"${c}"`)
        .join(', ')
    );
    process.exit(1);
  }

  command();
}
