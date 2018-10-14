import { Container } from "inversify";

import CoreBootstrapper from "../core/bootstrap";
import MarketBootstrapper from "../market/bootstrap";
import JobBootstrapper from "../jobs/bootstrap";

const container = new Container();

const bootstrap = (
  workerDefinition: core.IWorkerDefinition,
  exchangeConfig: core.IExchangeConfig
) => {
  CoreBootstrapper(container, workerDefinition);
  MarketBootstrapper(container, exchangeConfig);
  JobBootstrapper(container);
};

export { bootstrap, container };
