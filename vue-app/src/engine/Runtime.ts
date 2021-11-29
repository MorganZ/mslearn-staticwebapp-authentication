import nodeProxyHandler from "./runtimes/mutation/nodeProxyHandler";
import trackerProxyHandler from "./nodeDescriptorHandler";
import { EdgeBaseDefintion, PlanDefinition, IBaseSystem } from "./Types";

export default class Runtime {
    nodeToEdge = new Map<Object, EdgeBaseDefintion>();
    constructor() {}

    track<T extends PlanDefinition>(plan: T) {
        this.setNodeIds(plan);
        const nodes = this.buildNodes(plan);
        const edges = this.buildEdges(plan);
        const graph = this.buildGraph(nodes, edges); // use for monitoring
        //this.buildNodeActionSubs(nodes); // need if sending message without instance available or debug ??
        debug(nodes, edges);
        return { edges, nodes, graph };
    }

    private buildNodes(plan: PlanDefinition) {
        for (let [key, node] of Object.entries(plan.nodes)) {
            const newNode = this.buildNode(node);
            Reflect.set(plan.nodes, key, newNode);
        }
        return Object.values(plan.nodes);
    }

    //todo : constuire si n'est pas déjà construit
    private buildNode(node: IBaseSystem) {
        return nodeProxyHandler(node);
    }

    private buildEdges(plan: PlanDefinition) {
        const nodesTraked = Object.fromEntries(
            Object.entries(plan.nodes).map(([name, node]) => [
                name,
                new Proxy(node, trackerProxyHandler()),
            ])
        );
        const edges = plan.edges(nodesTraked) as EdgeBaseDefintion[];

        const monitor = plan.nodes.stream_system as any;
        for (const edge of edges) {
            edge.sub(monitor.stream_edges);
        }
        return edges;
    }

    private buildGraph(nodes: IBaseSystem[], edges: EdgeBaseDefintion[]) {
        var graph_nodes = nodes.map((n) => ({
            group: "nodes",
            data: { id: n.id, state: !!(n as any).state },
        }));
        var graph_edges = edges.map((e) => ({
            group: "edges",
            data: {
                id: e.id,
                idDesc: e.completId(),
                source: e.from.target.id,
                target: e.to.target.id,
                link: e.from.method + ">" + e.to.method,
            },
        }));
        return [...graph_nodes, ...graph_edges];
    }

    private setNodeIds(plan: PlanDefinition) {
        for (let key in plan.nodes) {
            let node = Reflect.get(plan.nodes, key);
            node.id = key;
        }
    }
}

function debug(nodes: IBaseSystem[], edges: EdgeBaseDefintion[]) {
    console.log("____debug____ ");
    console.log("nodes : ");
    for (let node of nodes) {
        console.log("\t", node.id);
    }
    console.log("edges : ");
    for (let edge of edges) {
        edge.debug();
    }
    console.log("____debug____ ");
    console.log("");
}
