/**
 * Turn a callback function into a promise function.
 */
export default function make(context: any, method: Function, args?: any[]) {
  if (!Array.isArray(args)) {
    args = [args];
  }

  return new Promise((resolve, reject) => {
    method.apply(
      context,
      args.concat([
        (err: any, result: any) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result);
        },
      ])
    );
  });
}

export function map(context: any, method: Function, items: any[]) {
  return Promise.all(
    items.map(item => {
      return make(context, method, item);
    })
  );
}
