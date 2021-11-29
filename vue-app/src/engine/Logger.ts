
export enum Log_Level {
    TRACE = 1,
    DEBUG,
    INFO,
    WARN,
    ERROR,
    DISABLE_LOGS
}

type logTypeFunc = (message?: unknown, ...optionalParams: unknown[]) => void;

let indent = 0;
let indentToken = " |";
let minLogLevel = Log_Level.TRACE;
let dumy = () => { };

function getLoggerFunc(fn: Function, params: any, logLevel: Log_Level = Log_Level.TRACE): logTypeFunc {
    if (minLogLevel > logLevel) return dumy;
    return Function.prototype.bind.apply(fn, params);
}

type logger = {
    trace: logTypeFunc,
    debug: logTypeFunc,
    log: logTypeFunc,
    warn: logTypeFunc,
    error: logTypeFunc,
    indent: () => void,
    unindent: () => VideoFacingModeEnum
}

export default function buildLogger(initiator: string, color: string) {
    let style = `color: white; background-color: ${color}; padding: 2px 6px; border-radius: 2px; font-size: 10px`;
    const paramsBase = [console, '%c' + initiator, style];

    return new Proxy({} as logger, {
        get: function (target, key, receiver) {
            var params = paramsBase.slice();
            const indentString = indentToken.repeat(indent);
            if(indentString)params.push(indentString);
            switch (key) {
                case "trace": return getLoggerFunc(console.debug, params, Log_Level.TRACE);
                case "debug": return getLoggerFunc(console.debug, params, Log_Level.DEBUG);
                case "log": return getLoggerFunc(console.log, params, Log_Level.INFO);
                case "warn": return getLoggerFunc(console.warn, params, Log_Level.WARN);
                case "error": return getLoggerFunc(console.error, params, Log_Level.ERROR);
                case "indent": return () => { indent++ };
                case "unindent": return () => { indent-- };
            }
        }
    });
}
