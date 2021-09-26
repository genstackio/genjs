import {IGenerator} from "@genjs/genjs";
import * as targets from './targets';
import javascriptBundleRegister from '@genjs/genjs-bundle-javascript';

export function register(generator: IGenerator): void {
    javascriptBundleRegister(generator);
    generator.registerPredefinedTargets(targets);
}

export * from './TypescriptPackage'

export default register