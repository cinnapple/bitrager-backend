import "reflect-metadata";
import { injectable } from "../inversify";

import axios from "axios";

@injectable()
export default class WebClient implements core.IWebClient {
  get = <TData>(url: string) => axios.get<TData>(url).then(a => a.data);
}
