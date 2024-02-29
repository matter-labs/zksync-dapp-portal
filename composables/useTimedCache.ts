export default function useTimedCache<ResultType, ParamsType extends unknown[]>(
  fn: (...args: ParamsType) => Promise<ResultType>,
  cacheTime: number
) {
  let cache: {
    params: ParamsType;
    promise: Promise<ResultType>;
    timestamp: number;
  };

  return (...args: ParamsType): Promise<ResultType> => {
    const now = Date.now();
    if (cache && now - cache.timestamp < cacheTime && JSON.stringify(cache.params) === JSON.stringify(args)) {
      return cache.promise;
    } else {
      const promise = fn(...args);
      cache = {
        params: args,
        promise,
        timestamp: now,
      };
      return promise;
    }
  };
}
