
export default function () {
    return {
        get(target: object, key: string, receiver) {
            let el = Reflect.get(target, key);
            if (typeof (el) !== 'function') throw new Error("only methode to use on traking mode");
            return {
                target: target,
                method: key,
            }
        },
    } as ProxyHandler<any>
}

