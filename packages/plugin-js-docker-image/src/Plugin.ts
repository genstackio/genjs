import {IGenerator, IPlugin} from '@genjs/genjs';
import Package from './Package';
import registerDockerImageBundle from '@genjs/genjs-bundle-docker-image';
import registerJavascriptBundle from '@genjs/genjs-bundle-javascript';

export default class Plugin implements IPlugin {
    register(generator: IGenerator): void {
        registerDockerImageBundle(generator);
        registerJavascriptBundle(generator);
        generator.registerPackager('js-docker-image', cfg => new Package(cfg));
    }
}