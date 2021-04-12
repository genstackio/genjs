import Package from './Package';
import {IGenerator, IPlugin} from '@genjs/genjs';
import registerAwsBundle from '@genjs/genjs-bundle-aws';
import registerJavascriptBundle from '@genjs/genjs-bundle-javascript';

export default class Plugin implements IPlugin {
    register(generator: IGenerator): void {
        registerAwsBundle(generator);
        registerJavascriptBundle(generator);
        generator.registerPackager('js-gatsby', cfg => new Package(cfg));
    }
}
