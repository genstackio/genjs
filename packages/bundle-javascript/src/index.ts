import {IGenerator} from "@genjs/genjs";
import * as targets from './targets';
import packageBundleRegister from '@genjs/genjs-bundle-package';

export function register(generator: IGenerator): void {
    packageBundleRegister(generator);
    generator.registerPredefinedTargets(targets);
}

export * from './JavascriptPackage'

export default register