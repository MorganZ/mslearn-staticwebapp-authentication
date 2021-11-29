
export interface IBaseSystem {
    id: string;
}

interface SystemBase {
    scene?: any;
    awake?(): void;
    start?(): void;
    dispose?(): void;
}

abstract class SystemBase implements IBaseSystem {
    public state: any;
    public id: string = "missing name";

    constructor() {
    }
}

export default SystemBase;



