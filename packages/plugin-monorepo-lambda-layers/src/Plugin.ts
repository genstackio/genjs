import Package from './Package';
import {IGenerator, IPlugin} from '@genjs/genjs';
import registerJavascriptBundle from '@genjs/genjs-bundle-javascript';

export default class Plugin implements IPlugin {
    register(generator: IGenerator): void {
        registerJavascriptBundle(generator);
        generator.registerPackager('monorepo-lambda-layers', cfg => new Package(cfg));
    }
}
