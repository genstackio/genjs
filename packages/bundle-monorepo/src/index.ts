import {IGenerator} from "@genjs/genjs";
import packageBundleRegister from '@genjs/genjs-bundle-package';

export function register(generator: IGenerator): void {
    packageBundleRegister(generator);
}

export * from './MonorepoPackage'

export default register