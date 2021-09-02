import Package from './Package';
import {IGenerator, IPlugin} from '@genjs/genjs';
import registerJavascriptBundle from '@genjs/genjs-bundle-javascript';
import registerScmBundle from '@genjs/genjs-bundle-scm';

export default class Plugin implements IPlugin {
    register(generator: IGenerator): void {
        registerJavascriptBundle(generator);
        registerScmBundle(generator);
        generator.registerPackager('monorepo-lambda-layers', cfg => new Package(cfg));
    }
}
