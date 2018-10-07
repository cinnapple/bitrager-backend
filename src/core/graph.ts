import "reflect-metadata";
import { injectable } from "../inversify";

import * as _ from "lodash";

@injectable()
export default class Graph<TData extends core.IData> {
  private _nodes: core.INode<TData>[] = [];
  private _edges: core.IEdge[] = [];

  get nodes() {
    return this._nodes;
  }

  get edges() {
    return this._edges;
  }

  nodeExists = (node: core.INode<TData>): boolean =>
    !!this._nodes.find(a => a.id === node.id);

  edgeExists = (edge: core.IEdge): boolean =>
    !!this._edges.find(a => a.from === edge.from && a.to === edge.to);

  addNode = (node: core.INode<TData>) =>
    !this.nodeExists(node) && this._nodes.push(node);

  addEdge = (edge: core.IEdge) =>
    !this.edgeExists(edge) && this._edges.push(edge);

  getEdgesFromNode = (nodeId: string) =>
    this._edges.filter(a => a.from === nodeId);

  getEdgesToNode = (nodeId: string) => this._edges.filter(a => a.to === nodeId);

  static serialize = <TData extends core.IData>(graph: Graph<TData>) =>
    JSON.stringify([graph._nodes, graph._edges]);

  static deserialize = <TData extends core.IData>(value: string) => {
    const graph = new Graph<TData>();
    const data = JSON.parse(value);
    graph._nodes = data[0];
    graph._edges = data[1];
    return graph;
  };

  private _findRouteDepthBfs = (
    fromId: string,
    cum: string[],
    currentHeight: number,
    maxHeight: number
  ) => {
    const newCurrentHeight = currentHeight + 1;
    if (currentHeight < maxHeight) {
      const toResult = this.getEdgesFromNode(fromId).map(e => {
        const newCum = cum.slice(0, cum.length);
        newCum.push(e.to);
        return this._findRouteDepthBfs(
          e.to,
          newCum,
          newCurrentHeight,
          maxHeight
        );
      });
      const fromResult = this.getEdgesToNode(fromId).map(e => {
        const newCum = cum.slice(0, cum.length);
        newCum.push(e.from);
        return this._findRouteDepthBfs(
          e.from,
          newCum,
          newCurrentHeight,
          maxHeight
        );
      });
      return fromResult.concat(toResult);
    }
    return cum;
  };

  findRouteDepth = (depth: number) => {
    const currentHeight = 1;
    const result = this._nodes.map(n => {
      const cum = [n.id];
      return this._findRouteDepthBfs(n.id, cum, currentHeight, depth);
    });
    return _.flattenDepth(result, depth - 1);
  };
}
