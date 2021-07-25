import IInitializer from './IInitializer';

export abstract class AbstractInitializer implements IInitializer {
    protected constructor() {
    }
    abstract execute(dir: string, vars: any): Promise<void>;
}

export default AbstractInitializer