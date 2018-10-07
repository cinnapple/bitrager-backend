import { injectable, inject } from "inversify";

import Core from "../core/bootstrap.types";
import Market from "../market/bootstrap.types";
import Job from "../jobs/bootstrap.types";

const TYPES = {
  ...Core,
  ...Market,
  ...Job
};

export { TYPES, inject, injectable };
