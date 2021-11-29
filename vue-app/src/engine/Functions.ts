import { IBaseSystem } from "./SystemBase";

export function getMethodNamesForNode(node: IBaseSystem) {
    const functionNames = [
        // declared object function
        ...Object.getOwnPropertyNames(node.constructor.prototype),
        // Special case for arrow function in prop : test : (data:any)=>{ ... }
        ...Object.entries(node)
            .filter(([methodName, prop]) => typeof prop == "function")
            .map(([methodName, prop]) => methodName),
    ];
    if (functionNames.length != new Set(functionNames).size) {
        console.error("duplicate endpoints");
    }
    return functionNames;
}