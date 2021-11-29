import buildLogger  from '@/engine/Logger';
import { getMethodNamesForNode } from '@/engine/Functions';
import { IBaseSystem, isProxySymbol, signalSymbol, targetSymbol } from '@/engine/Types';

let Logger = buildLogger("M ", "purple");

const actionHandler = function(eventName: string) {
    return {
        apply(target: any, thisArgs: any, argArray: any) {
            // const start = performance.now();
            // Logger.log(`node endpoint : ${eventName} in : `, {input:argArray[0]} ?? "");
            // Logger.indent();
            let output = target(argArray[0]);
            // Logger.unindent();
            // Logger.log(`node endpoint : ${eventName} out (in ${(performance.now()-start).toFixed(2)} ms): `, {output} ?? "void");
            //replace
            const edges = target.signals;

            for (let i = 0; i < edges.length; i++) {
                edges[i](output);
            }
            //mediator.publish(eventName + ":out", output);
            return output;
        },
    } as ProxyHandler<any>;
};

export default function<T>(node: T & IBaseSystem & any): T {

    const funcNames = getMethodNamesForNode(node);

    node[signalSymbol] = new Map<string, []>(
        funcNames.map((fname) => [fname, []])
    );

    node[isProxySymbol] = true;
    node[targetSymbol] = node;

    for (const key of funcNames) {
        let eventName = `${node.id}.${key}`;
        let action = Reflect.get(node, key).bind(node);
        action.signals = node[signalSymbol].get(key);
        const func = new Proxy(action, actionHandler(eventName));
        Reflect.set(node, key, func);
    }

    return node;
}
