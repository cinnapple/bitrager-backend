import { Container } from "inversify";

import CoreBootstrapper from "../core/bootstrap";
import MarketBootstrapper from "../market/bootstrap";
import JobBootstrapper from "../jobs/bootstrap";

const container = new Container();

CoreBootstrapper(container);
MarketBootstrapper(container);
JobBootstrapper(container);
export { container };
