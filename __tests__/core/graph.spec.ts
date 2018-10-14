import "jest";
import GraphOp from "../../src/core/graphOp";

const btc: model.ICurrency = { id: "BTC", name: "Bitcoin1" };
const xrp: model.ICurrency = { id: "XRP", name: "Ripple" };
const eth: model.ICurrency = { id: "ETH", name: "Ethereum" };
const dge: model.ICurrency = { id: "DGE", name: "Dodge" };
const usdt: model.ICurrency = { id: "USDT", name: "Tether" };
const btc2: model.ICurrency = { id: "BTC", name: "Bitcoin2" };

const currencyNodes: core.INode<model.ICurrency>[] = [
  { id: btc.id, data: btc },
  { id: xrp.id, data: xrp },
  { id: eth.id, data: eth },
  { id: dge.id, data: dge },
  { id: usdt.id, data: usdt },
  { id: btc2.id, data: btc2 }
];

describe("Graph", () => {
  test("addNode", () => {
    const graph = new GraphOp<model.ICurrency>();
    currencyNodes.forEach(node => graph.addNode(node));

    expect(graph.nodes).toEqual(currencyNodes.slice(0, 5));
    expect(graph.nodes[0].data).toEqual(btc);
    expect(graph.nodes[0].data.id).toEqual("BTC");
    expect(graph.nodes[0].data.name).toEqual("Bitcoin1");
  });

  test("addEdge", () => {
    const graph = new GraphOp<model.ICurrency>();
    currencyNodes.forEach(node => graph.addNode(node));

    const xrp_btc: core.IEdge = { from: xrp.id, to: btc.id };
    graph.addEdge(xrp_btc);

    const xrp_eth: core.IEdge = { from: xrp.id, to: eth.id };
    graph.addEdge(xrp_eth);

    const btc_eth: core.IEdge = { from: btc.id, to: eth.id };
    graph.addEdge(btc_eth);

    const xrp_btc2: core.IEdge = { from: xrp.id, to: btc2.id };
    graph.addEdge(xrp_btc2);

    expect(graph.edges.length).toEqual(3);

    expect(graph.edges[0].from).toEqual(xrp.id);
    expect(graph.edges[0].to).toEqual(btc.id);

    expect(graph.edges[1].from).toEqual(xrp.id);
    expect(graph.edges[1].to).toEqual(eth.id);

    expect(graph.edges[2].from).toEqual(btc.id);
    expect(graph.edges[2].to).toEqual(eth.id);
  });

  test("bfs", () => {
    const graph = new GraphOp<model.ICurrency>();
    currencyNodes.forEach(node => graph.addNode(node));

    // xrp -> btc -> eth -> xrp
    const xrp_btc: core.IEdge = { from: xrp.id, to: btc.id };
    graph.addEdge(xrp_btc);

    const btc_eth: core.IEdge = { from: btc.id, to: eth.id };
    graph.addEdge(btc_eth);

    const xrp_eth: core.IEdge = { from: xrp.id, to: eth.id };
    graph.addEdge(xrp_eth);

    const result = graph.findRouteDepth(4);
    expect(result).toEqual([
      ["BTC", "XRP", "BTC", "XRP"],
      ["BTC", "XRP", "BTC", "ETH"],
      ["BTC", "XRP", "ETH", "BTC"],
      ["BTC", "XRP", "ETH", "XRP"],
      ["BTC", "ETH", "BTC", "XRP"],
      ["BTC", "ETH", "BTC", "ETH"],
      ["BTC", "ETH", "XRP", "BTC"],
      ["BTC", "ETH", "XRP", "ETH"],
      ["XRP", "BTC", "XRP", "BTC"],
      ["XRP", "BTC", "XRP", "ETH"],
      ["XRP", "BTC", "ETH", "BTC"],
      ["XRP", "BTC", "ETH", "XRP"],
      ["XRP", "ETH", "BTC", "XRP"],
      ["XRP", "ETH", "BTC", "ETH"],
      ["XRP", "ETH", "XRP", "BTC"],
      ["XRP", "ETH", "XRP", "ETH"],
      ["ETH", "BTC", "XRP", "BTC"],
      ["ETH", "BTC", "XRP", "ETH"],
      ["ETH", "BTC", "ETH", "BTC"],
      ["ETH", "BTC", "ETH", "XRP"],
      ["ETH", "XRP", "BTC", "XRP"],
      ["ETH", "XRP", "BTC", "ETH"],
      ["ETH", "XRP", "ETH", "BTC"],
      ["ETH", "XRP", "ETH", "XRP"]
    ]);
  });
});
