declare namespace core {
  export interface HashMap<T> {
    [data: string]: T;
  }

  export interface IData {
    id: string;
  }

  export interface INode<TData extends IData> {
    id: string;
    data: TData;
  }

  export interface IEdge {
    from: string;
    to: string;
  }

  export interface IGraph<TData extends IData> {
    nodes: INode<TData>[];
    edges: IEdge[];
    addNode(node: INode<TData>): void;
    addEdge(edge: IEdge): void;
  }

  export interface IWebClient {
    get<TData>(url: string): Promise<TData>;
  }

  export interface IJobProcessor {
    registerJob: (job: IJob) => void;
    fire: (interval: number) => void;
  }

  export interface IJob {
    name: string;
    execute: (previous: IJobResult) => Promise<IJobResult>;
  }

  export interface IJobResult {
    continue: boolean;
    result: any;
    error: Error;
    ticks?: number;
  }

  export interface IWorkerDefinition {
    id: string;
    name: string;
    interval: number;
    jobs: string[];
    config: any;
  }

  export interface IExchangeConfig {
    id: "poloniex";
    takerFees: number;
  }

  export interface IConfig {
    redis: {
      port: number;
    };
    slack: {
      token: string;
      conversationId: string;
      url: string;
    };
    maxDepth: number;
    maxUSD: number;
    startCurrency: string;
    exchanges: IExchangeConfig[];
    workers: IWorkerDefinition[];
  }

  export interface ICache {
    get<T>(key: string, deserializer?: (value: string) => T): Promise<T>;
    set<T>(
      key: string,
      data: T,
      serializer?: (value: T) => string
    ): Promise<void>;
  }

  export interface ITimer {
    lap: () => number;
    start: () => void;
  }

  export interface IPlanResult {
    qty: number;
    states: any[];
    route: string[];
    profit: number;
  }

  export interface IExecutionPlan {
    status: "new" | "executed";
    plans: IPlanResult[];
  }

  export interface IReporter {
    notify: (message: string) => void;
  }
}
