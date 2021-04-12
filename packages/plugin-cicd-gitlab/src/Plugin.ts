import Package from './Package';
import {IGenerator, IPlugin} from '@genjs/genjs';
import registerCicdBundle from '@genjs/genjs-bundle-cicd';

export default class Plugin implements IPlugin {
    register(generator: IGenerator): void {
        registerCicdBundle(generator);
        generator.registerPackager('cicd-gitlab', cfg => new Package(cfg));
    }
}
