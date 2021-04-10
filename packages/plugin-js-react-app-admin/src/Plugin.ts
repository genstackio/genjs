import Package from './Package';
import {IGenerator, IPlugin} from '@genjs/genjs';
import registerJavascriptBundle from '@genjs/genjs-bundle-javascript';
import registerAwsBundle from '@genjs/genjs-bundle-aws';

export default class Plugin implements IPlugin {
    register(generator: IGenerator): void {
        registerAwsBundle(generator);
        registerJavascriptBundle(generator);
        generator.registerPackager('js-react-app-admin', cfg => new Package(cfg));
    }
}
