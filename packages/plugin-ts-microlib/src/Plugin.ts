import Package from './Package';
import {IGenerator, IPlugin} from '@genjs/genjs';
import registerMicrolibBundle from '@genjs/genjs-bundle-microlib';

export default class Plugin implements IPlugin {
    register(generator: IGenerator): void {
        registerMicrolibBundle(generator);
        generator.registerPackager('ts-microlib', cfg => new Package(cfg));
    }
}
