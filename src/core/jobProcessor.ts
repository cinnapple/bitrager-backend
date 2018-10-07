import "reflect-metadata";
import { injectable, inject, TYPES } from "../inversify";

@injectable()
export default class JobProcessor implements core.IJobProcessor {
  private _jobs: core.IJob[] = [];
  private _lock: boolean = false;

  constructor(@inject(TYPES.Core.Timer) private _timer: core.ITimer) {}

  registerJob = (job: core.IJob) => {
    this._jobs.push(job);
  };

  private _report = (job: core.IJob, result: core.IJobResult) => {
    console.log(`${job.name} took ${result.ticks} ms`);
  };

  private _fire = async () => {
    if (!this._lock) {
      this._lock = true;
      let previousResult: core.IJobResult = <any>{
        continue: true
      };
      for (const job of this._jobs) {
        if (previousResult.continue) {
          console.log(`${job.name} started`);
          this._timer.start();
          previousResult = await job.execute(previousResult);
          previousResult.ticks = this._timer.lap();
          this._report(job, previousResult);
        }
      }
      this._lock = false;
    }
  };

  fire = async (interval: number) => {
    this._fire();
    setInterval(async () => {
      this._fire();
    }, interval);
  };
}
