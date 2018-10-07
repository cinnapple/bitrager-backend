import "reflect-metadata";
import { injectable } from "../inversify";

@injectable()
export default class Timer implements core.ITimer {
  private _start: number;

  start = () => {
    this._start = new Date().getTime();
  };

  lap = () => {
    return new Date().getTime() - this._start;
  };
}
