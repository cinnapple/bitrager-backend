import { Container } from "inversify";
import TYPES from "./bootstrap.types";

import FetchCurrencyPairs from "./fetchCurrencyPairs";
import FindTriangularPaths from "./findTriangularPaths";
import RefreshOrderbooks from "./refreshOrderbooks";
import PlanArbitrage from "./planArbitrage";

export default (container: Container) => {
  container
    .bind<core.IJob>(TYPES.Job.FetchCurrencyPairs)
    .to(FetchCurrencyPairs)
    .inSingletonScope();
  container
    .bind<core.IJob>(TYPES.Job.FindTriangularPaths)
    .to(FindTriangularPaths)
    .inSingletonScope();
  container
    .bind<core.IJob>(TYPES.Job.RefreshOrderbooks)
    .to(RefreshOrderbooks)
    .inSingletonScope();
  container
    .bind<core.IJob>(TYPES.Job.PlanArbitrage)
    .to(PlanArbitrage)
    .inSingletonScope();
};
