import { Container } from "inversify";
import TYPES from "./bootstrap.types";

import config from "../config";
import Cache from "./cache";
import JobProcessor from "./jobProcessor";
import Timer from "./timer";
import WebClient from "./webClient";
import Reporter from "./reporter";

export default (
  container: Container,
  workerDefinition: core.IWorkerDefinition
) => {
  container.bind<core.IConfig>(TYPES.Core.Config).toConstantValue(<any>{
    ...config,
    ...workerDefinition
  });
  container
    .bind<core.ICache>(TYPES.Core.Cache)
    .to(Cache)
    .inSingletonScope();
  container
    .bind<core.IJobProcessor>(TYPES.Core.JobProcessor)
    .to(JobProcessor)
    .inSingletonScope();
  container
    .bind<core.ITimer>(TYPES.Core.Timer)
    .to(Timer)
    .inSingletonScope();
  container
    .bind<core.IWebClient>(TYPES.Core.WebClient)
    .to(WebClient)
    .inSingletonScope();
  container
    .bind<core.IReporter>(TYPES.Core.Reporter)
    .to(Reporter)
    .inSingletonScope();
};
