import Package from './Package';
import {IGenerator, IPlugin} from '@genjs/genjs';
import registerJavascriptBundle from '@genjs/genjs-bundle-javascript';
import registerAwsBundle from '@genjs/genjs-bundle-aws';
import registerDockerBundle from '@genjs/genjs-bundle-docker';

export default class Plugin implements IPlugin {
    register(generator: IGenerator): void {
        registerAwsBundle(generator);
        registerDockerBundle(generator);
        registerJavascriptBundle(generator);
        generator.registerPackager('js-next', cfg => new Package(cfg));
    }
}
