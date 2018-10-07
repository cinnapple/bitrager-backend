import { argv } from "yargs";
import { TYPES } from "./inversify";
import { container } from "./inversify/bootstrap";
import config from "./config";

const workerDefinition = config.workers.find(a => a.id === argv.work);

if (!workerDefinition) {
  throw new Error(`no workder definition found for work id '${argv.work}'`);
}

console.log(`worker '${workerDefinition.id}' started`);

// merge the core config with the worker specific config.
container.bind<any>(TYPES.Core.Config).toConstantValue({
  ...config,
  ...workerDefinition.config
});

// start the processor
const processor = container.get<core.IJobProcessor>(TYPES.Core.JobProcessor);
workerDefinition.jobs.forEach(job => {
  if (!TYPES.Job[job]) {
    throw new Error(`job ${job} not found in TYPES.Job`);
  }
  processor.registerJob(container.get<core.IJob>(TYPES.Job[job]));
});
processor.fire(workerDefinition.interval);
