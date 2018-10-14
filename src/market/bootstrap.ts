import { Container } from "inversify";
import TYPES from "./bootstrap.types";

import PoloniexAdvisor from "./poloniexAdvisor";
import KrakenAdvisor from "./krakenAdvisor";
import { Exchange } from "../core/enum";

export default (container: Container, exchangeConfig: core.IExchangeConfig) => {
  if (exchangeConfig.id === Exchange.kraken) {
    container
      .bind<market.IExpertAdvisor>(TYPES.Market.ExpertAdvisor)
      .to(KrakenAdvisor)
      .inSingletonScope();
  }
  if (exchangeConfig.id === Exchange.poloniex) {
    container
      .bind<market.IExpertAdvisor>(TYPES.Market.ExpertAdvisor)
      .to(PoloniexAdvisor)
      .inSingletonScope();
  }
};
