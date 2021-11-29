import { SystemBase } from '../';

import buildLogger from '../Logger';
const Logger = buildLogger("WS", "blue")

export class StreamInSystem extends SystemBase {
    socket: WebSocket | null = null;
    connected = false;

    urlStream = "ws://localhost:5000/ws";
    async awake() {
        let socket = new WebSocket(this.urlStream)
        this.socket = socket;
        socket.onopen = function (event) { };
        socket.onclose = function (event) { };
        socket.onerror = function (event) { };
        socket.onmessage = (event) => {
            this.receiveJson(event.data);
        };
    }


    receiveJson = (data: any) => data;
}
