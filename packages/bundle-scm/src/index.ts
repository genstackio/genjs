import {IGenerator} from "@genjs/genjs";
import * as targets from './targets';

export function register(generator: IGenerator): void {
    generator.registerPredefinedTargets(targets);
}

export * from './helpers';

export default register