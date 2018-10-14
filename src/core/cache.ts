import "reflect-metadata";
import { injectable, inject, TYPES } from "../inversify";

import * as redis from "redis";

@injectable()
export default class Cache implements core.ICache {
  private _client: redis.RedisClient;

  constructor(@inject(TYPES.Core.Config) _config: core.IConfig) {
    this._client = redis.createClient({
      port: _config.redis.port
    });
  }

  get = <T>(
    key: string,
    deserializer: (value: string) => T = s => JSON.parse(s)
  ) => {
    return new Promise<T>((resolve, reject) => {
      this._client.get(key, (err, value: string) => {
        if (!err) {
          resolve(deserializer(value));
        } else {
          reject(err);
        }
      });
    });
  };

  set = <T>(
    key: string,
    value: T,
    serializer: (value: T) => string = v => JSON.stringify(v)
  ) => {
    return new Promise<T>(resolve => {
      this._client.set(key, serializer(value), () => {
        console.log(`- ${key} cached`);
        resolve(value);
      });
    });
  };
}
