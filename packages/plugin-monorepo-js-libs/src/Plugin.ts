import Package from './Package';
import {IGenerator, IPlugin} from '@genjs/genjs';
import registerJavascriptBundle from '@genjs/genjs-bundle-javascript';
import registerTypescriptBundle from '@genjs/genjs-bundle-typescript';
import registerAwsBundle from '@genjs/genjs-bundle-aws';
import registerScmBundle from '@genjs/genjs-bundle-scm';

export default class Plugin implements IPlugin {
    register(generator: IGenerator): void {
        registerJavascriptBundle(generator);
        registerTypescriptBundle(generator);
        registerAwsBundle(generator);
        registerScmBundle(generator);
        generator.registerPackager('monorepo-js-libs', cfg => new Package(cfg));
    }
}
