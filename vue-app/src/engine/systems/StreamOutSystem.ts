import { SystemBase } from '../';
import buildLogger from '../Logger';

const Logger = buildLogger("WS", "blue")

export class StreamOutSystem extends SystemBase {

    socket: WebSocket | null = null;
    connected = false;

    queue: number[] = [];
    graph: any;
    urlStream = "ws://localhost:5000/ws";;
    async awake() {
        let socket = new WebSocket(this.urlStream);
        socket.readyState
        socket.onopen = (event) => { this.connected = true; };
        socket.onclose = (event) => { this.connected = false; };
        socket.onerror = function (event) { Logger.error('WebSocket error observed:', event); };
        socket.onmessage = function (event) { Logger.error("this WebSocket can't received any:", event); };
        this.socket = socket;
        this.startMonitoring(socket);
    }

    stream_graph(graph: any) {
        this.graph = graph;
    }

    stream_edges(data: number) {
        this.queue.push(data);
    }

    startMonitoring(socket : WebSocket) {
        setInterval(() => {
            if (this.connected) {
                if (this.graph) {
                    socket.send(JSON.stringify(this.graph));
                    this.graph = undefined;
                }
                if (this.queue.length > 0) {
                    const buffer = new ArrayBuffer(this.queue.length);
                    const view = new Int8Array(buffer);
                    for (let i = 0; i < this.queue.length; i++) {
                        view[i] = this.queue[i];
                    }
                    socket.send(view);
                    this.queue = [];
                }
            }
        }, 500);
    }

    stopMonitoring(){
        
    }
}
