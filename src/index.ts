import { argv } from "yargs";
import { TYPES } from "./inversify";
import { container, bootstrap } from "./inversify/bootstrap";
import config from "./config";

// retrieve the worker definition and exchange based on the arguments.
const workerDefinition = config.workers.find(a => a.id === argv.work);
const exchangeConfig = config.exchanges.find(a => a.id === argv.exchange);
if (!workerDefinition || !exchangeConfig) {
  throw new Error(
    `no workder definition found for '${argv.exchange}.${argv.work}'`
  );
}

// bootstrap dependencies.
bootstrap(workerDefinition, exchangeConfig);

// register the worker jobs for this worker to the processor
const processor = container.get<core.IJobProcessor>(TYPES.Core.JobProcessor);
workerDefinition.jobs.forEach(job => {
  if (!TYPES.Job[job]) {
    throw new Error(`job ${job} not found in TYPES.Job`);
  }
  processor.registerJob(container.get<core.IJob>(TYPES.Job[job]));
});

// start
console.log(`starting the worker '${argv.exchange}.${workerDefinition.id}'...`);
processor.fire(workerDefinition.interval);
