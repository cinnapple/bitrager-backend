import { Container } from "inversify";
import TYPES from "./bootstrap.types";

import Cache from "./cache";
import Graph from "./graph";
import JobProcessor from "./jobProcessor";
import Timer from "./timer";
import WebClient from "./webClient";
import Reporter from "./reporter";

export default (container: Container) => {
  container
    .bind<core.ICache>(TYPES.Core.Cache)
    .to(Cache)
    .inSingletonScope();
  container
    .bind<core.IGraph<any>>(TYPES.Core.Graph)
    .to(Graph)
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
