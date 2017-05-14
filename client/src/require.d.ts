interface Require {
  (module: string): any;
}

// Ambient declaration for 'require'
declare var require: Require;
