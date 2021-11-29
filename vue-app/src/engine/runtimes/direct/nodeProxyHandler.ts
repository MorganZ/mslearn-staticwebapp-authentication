import { isProxySymbol, signalSymbol, targetSymbol } from '@/engine/Types';

import buildLogger  from '@/engine/Logger';

let Logger = buildLogger("M ", "purple");

const actionHandler = function (eventName: string) {
    return {
        apply(target: any, thisArgs: any, argArray: any) {
            let output = target(argArray[0]);
            const edges = target[signalSymbol];
            for (let i = 0; i < edges.length; i++) {
                edges[i](output);
            }
            return output;
        }
    } as ProxyHandler<any>;
}

export default function (funcMap: Map<string, Function[]>) {
    return {
        get(target: any, key: string, receiver) {
            var cachekey = '_x_' + key.toString();
            let op = Reflect.get(target, cachekey);
            if (op) { return op; }

            let action = Reflect.get(target, key);
            if (typeof (action) !== 'function') {
                if ((key as unknown as symbol) === isProxySymbol) {
                    return true;
                }
                if ((key as unknown as symbol) === targetSymbol) {
                    return target
                }
                return action;
            }
            let eventName = `${target.id}.${key}`;
            const bounded = action.bind(receiver);
            bounded[signalSymbol] = funcMap.get(key);
            const func = new Proxy(bounded, actionHandler(eventName));
            target[cachekey] = func;
            return func;
        },
    } as ProxyHandler<any>
}
