let Promise = require('bluebird');

/**
 * Turn a callback function into a promise function.
 */
export default function make(context: any, method: Function, args?: any[]) {
  if (!Array.isArray(args)) {
    args = [args];
  }

  return new Promise((resolve: EventListener, reject: EventListener) => {
    method.apply(context, args.concat([(err: Event, result: any) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    }]));
  });
}

export function map(context: any, method: Function, items: any[]) {
  return Promise.all(items.map(item => {
    return method.call(context, item);
  }));
}
