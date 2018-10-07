import { Container } from "inversify";
import TYPES from "./bootstrap.types";

import PoloResponseCanonicalizer from "./poloniex/poloResponseCanonicalizer";

export default (container: Container) => {
  container
    .bind<market.IResponseCanonicalizer>(TYPES.Market.PoloResponseCanonicalizer)
    .to(PoloResponseCanonicalizer)
    .inSingletonScope();
};
