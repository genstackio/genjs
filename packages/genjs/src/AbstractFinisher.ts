import IFinisher from './IFinisher';

export abstract class AbstractFinisher implements IFinisher {
    protected constructor() {
    }
    abstract execute(dir: string, vars: any): Promise<void>;
}

export default AbstractFinisher