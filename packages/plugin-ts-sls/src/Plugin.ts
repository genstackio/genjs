import Package from './Package';
import {IGenerator, IPlugin} from '@genjs/genjs';
import registerTypescriptBundle from '@genjs/genjs-bundle-typescript';

export default class Plugin implements IPlugin {
    register(generator: IGenerator): void {
        registerTypescriptBundle(generator)
        generator.registerPackager('ts-sls', cfg => new Package(cfg));
    }
}
