import buildLogger from '@/engine/Logger';

export const targetSymbol = Symbol("target");
export const signalSymbol = Symbol("signal");
export const isProxySymbol = Symbol("signal");

let Logger = buildLogger("EM", "grey");
export interface IBaseSystem {
    id: string;
}

export const eventNames = function (node: IBaseSystem, methodName: string) {
    return {
        eventIn: `${node.id}.${methodName}:in`,
        eventOut: `${node.id}.${methodName}:out`
    }
}

type signal = { [signalSymbol]: Map<string, Function[]> }
let id_counter = 0;
export class EdgeBaseDefintion {
    eventOut: string = "";
    eventIn: string = "";
    from: { target: IBaseSystem & signal & any, method: string } = { target: { id: "__", className: "", [signalSymbol]: new Map() }, method: "" };
    to: { target: IBaseSystem & signal & any, method: string } = { target: { id: "__", className: "", [signalSymbol]: new Map() }, method: "" };
    id = id_counter++;
    completId(){
        return `${this.from.target.id}:${this.from.method}:out > in:${this.to.target.id}:${this.to.method}`;
    }
    serialize(){
        return {
            from : { node : this.from.target.id, action:  this.from.method },
            to :{ node : this.to.target.id, action:  this.to.method }

        }
    }
    transform?: (payload: any) => any;
    // id() {
    //     return `(${this.from.target.id}):${this.from.method}>(${this.to.target.id}):${this.to.method}`
    // }

    debug() {
        return Logger.log(`  [>>>] ${this.completId()}`);
    }
    sub(monitor: Function) { }
    unsub() { }
}

export class EdgeDefinition<TPayload> extends EdgeBaseDefintion {
    constructor(from: (payload: any) => TPayload, to: (payload: TPayload) => any) {
        super();
        this.from = from as unknown as { target: any & signal, method: string };
        this.to = to as unknown as { target: any, method: string };
        this.eventOut = eventNames(this.from.target, this.from.method).eventOut;
        this.eventIn = eventNames(this.to.target, this.to.method).eventIn;
    }
    sub(monitor: Function) {
        const action = this.to.target[this.to.method];
        const subs = this.from.target[signalSymbol].get(this.from.method);
        //subs.push(action);
        subs.push((payload: any) => {
            if(monitor) monitor(this.id);
           // this.debug();
            action(payload)
        });
    }
}

export class EdgeDefinitionWithTranforms<Tin, Tout> extends EdgeBaseDefintion {
    constructor(from: (payload: any) => Tin, public transform: (payload: Tin) => Tout, to: (payload: Tout) => any) {
        super();
        this.from = from as unknown as { target: any, method: string };
        this.to = to as unknown as { target: any, method: string };
        this.eventOut = eventNames(this.from.target, this.from.method).eventOut;
        this.eventIn = eventNames(this.to.target, this.to.method).eventIn;
    }

    sub(monitor: Function) {
        const action = this.to.target[this.to.method];
        const subs = this.from.target[signalSymbol].get(this.from.method) ;
        subs.push((payload: any) => {
            this.debug();
            if(monitor) monitor(this.id);
            const payloadTransformed = this.transform(payload);
            action(payloadTransformed)
        });
    }
}

export interface PlanDefinition {
    nodes: { [key: string]: IBaseSystem };
    edges: (nodes: { [key: string]: IBaseSystem }) => EdgeBaseDefintion[];
}
