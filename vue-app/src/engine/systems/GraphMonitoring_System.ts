import { SystemBase } from '../';

type Edge = { group: 'edges', data: { id: string, source: string, target: string, label: string, value: number, message: string, calls: number } }
type Node = { group: 'nodes', data: { id: string, name: string, group: number, parent?: string } }

type JsonFormatExport = (Edge | Node)[]

export default class GraphMonitoring_System extends SystemBase {
    Chain: Map<string, number> = new Map();
    needUpdate = false;

    state = {
        nodes: new Map() as Map<string, Node>,
        edges: [] as Edge[],
        dot: "digraph g { }",
        json: [] as JsonFormatExport,
        groups: new Set<string>(),
        edgesStream: [] as number[]
    }
    
    debouncer = this.debounce(() => { this.udpateGraph() }, 1000);
     //todo : update to message

    async update_graph(data: any) {
        if(data instanceof Blob){
            console.log("receive blob")
            const buffer = await data.arrayBuffer();
            const art = new Int8Array(buffer);
            for(let i= 0; i< art.length; i++){
                this.state.edgesStream.push(art[i]);
            }
        }
        else{
            this.state.json = JSON.parse(data);
        }
        //if (path.includes("[input]")) debugger;
        //if (path.includes("graphmonitoring_system")) return;
        //this.debouncer();
        //this.Chain.set(path, (this.Chain.get(path) || -1) + 1);
    }

    debug_graph() {
        console.log(JSON.stringify(this.state.json, null, "\t"));
        console.log(this.Chain);
    };

    private debounce(func: Function, delay: number, immediate: boolean = false) {
        var timeout: number = 0;
        if (immediate) {
            return () => {
                if (!timeout) func();
                clearTimeout(timeout)
                timeout = window.setTimeout(() => timeout = 0, delay)
            }
        }
        return () => {
            clearTimeout(timeout)
            timeout = window.setTimeout(() => func(), delay);
        }
    }

    private udpateGraph() {
        this.state.dot = this.renderDot();
        this.state.json = this.renderJson();
    }

    renderDot(): string {
        let dot = "digraph g { \n";
        for (let data of this.state.edges) {
            let edge = data.data;
            dot += `\t${edge.source} -> ${edge.target} [ label ="${edge.message} (${edge.calls})"];\n`;
        }
        dot += "}\n";
        return dot;
    }

    renderJson(): JsonFormatExport {
        return [...this.state.nodes.values(), ...this.state.edges];
    }
}

