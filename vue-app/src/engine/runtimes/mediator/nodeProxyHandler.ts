export const targetSymbol = Symbol("target");
export const signalSymbol = Symbol("signal");
export const isProxySymbol = Symbol("signal");

import buildLogger from '@/engine/Logger';
import { Mediator } from './Mediator';

let Logger = buildLogger("M ", "purple");



// private buildNodeActionSubs(nodes: any) {
//     for (let node of nodes) {
//         const target = node[targetSymbol];
//         for (var methodName of Object.getOwnPropertyNames(target.constructor.prototype)) {
//             let actionFunction = node[methodName];
//             if (typeof (actionFunction) == 'function' && methodName !== "constructor") {
//                 const eventIn = eventNames(target, methodName).eventIn;
//                 console.log(eventIn);
//                 this.mediator.subscribe(eventIn, (inPaylaod) => {
//                     actionFunction(inPaylaod);
//                 });
//             }
//         }
//     }
// }


// const sub = mediator.subscribe(this.eventOut, (paylaod) => {
//     console.log("edge message :", this.eventOut, "-", this.eventIn);
//     //mediator.publish(eventIn, paylaod);
//     action(paylaod);
// });
// this.unsub = () => {
//     mediator.unSubscribe(sub);
// }

const actionHandler = function (eventName: string, mediator : Mediator) {
    return {
        apply(target: any, thisArgs: any, argArray: any) {
            let output = target(argArray[0]);
            mediator.publish(eventName + ":out", output);
            return output;
        }
    } as ProxyHandler<any>;
}

export default function (funcMap: Map<string, Function[]>, mediator:Mediator) {
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
            bounded.signals = funcMap.get(key);
            const func = new Proxy(bounded, actionHandler(eventName, mediator));
            target[cachekey] = func;
            return func;
        },
    } as ProxyHandler<any>
}
