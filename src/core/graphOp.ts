import "reflect-metadata";
import { injectable } from "../inversify";

import * as _ from "lodash";

@injectable()
export default class GraphOp<TData extends core.IData>
  implements core.IGraphOp<TData> {
  constructor(private _graph?: core.IGraph<TData>) {
    if (!_graph) {
      this._graph = {
        nodes: [],
        edges: []
      };
    }
  }

  get nodes() {
    return this._graph.nodes;
  }

  get edges() {
    return this._graph.edges;
  }

  get graph() {
    return this._graph;
  }

  nodeExists = (node: core.INode<TData>): boolean =>
    !!this._graph.nodes.find(a => a.id === node.id);

  edgeExists = (edge: core.IEdge): boolean =>
    !!this._graph.edges.find(a => a.from === edge.from && a.to === edge.to);

  addNode = (node: core.INode<TData>) =>
    !this.nodeExists(node) && this._graph.nodes.push(node);

  addEdge = (edge: core.IEdge) =>
    !this.edgeExists(edge) && this._graph.edges.push(edge);

  getEdgesFromNode = (nodeId: string) =>
    this._graph.edges.filter(a => a.from === nodeId);

  getEdgesToNode = (nodeId: string) =>
    this._graph.edges.filter(a => a.to === nodeId);

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
    const result = this._graph.nodes.map(n => {
      const cum = [n.id];
      return this._findRouteDepthBfs(n.id, cum, currentHeight, depth);
    });
    return _.flattenDepth(result, depth - 1);
  };
}
