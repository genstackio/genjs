import {IGenerator} from "@genjs/genjs";
import * as targets from './targets';
import awsBundleRegister from '@genjs/genjs-bundle-aws';
import packageBundleRegister from '@genjs/genjs-bundle-package';

export function register(generator: IGenerator): void {
    awsBundleRegister(generator);
    packageBundleRegister(generator);
    generator.registerPredefinedTargets(targets);
}

export * from './AwsLambdaPackage'
export * from './helpers';

export default register