/**
 * Turn a callback function into a promise function.
 */
export default function run(
  context: any,
  method: Function,
  args?: any
): Promise<any> {
  if (!Array.isArray(args)) {
    args = [args];
  }

  return new Promise((resolve, reject) => {
    method.apply(
      context,
      args.concat([
        (err: any, ...rest: any[]) => {
          if (err) {
            reject(err);
            return;
          }
          resolve.apply(null, rest);
        },
      ])
    );
  });
}

export function map(context: any, method: Function, items: any): Promise<any> {
  return Promise.all(
    items.map((item: any) => {
      return run(context, method, item);
    })
  );
}
