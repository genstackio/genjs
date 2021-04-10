import {IGenerator} from "@genjs/genjs";
import * as targets from './targets';
import dockerBundleRegister from '@genjs/genjs-bundle-docker';
import packageBundleRegister from '@genjs/genjs-bundle-package';

export function register(generator: IGenerator): void {
    dockerBundleRegister(generator);
    packageBundleRegister(generator);
    generator.registerPredefinedTargets(targets);
}

export * from './DockerImagePackage'

export default register