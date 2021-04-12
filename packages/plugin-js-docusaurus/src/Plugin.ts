import Package from './Package';
import {IGenerator, IPlugin} from '@genjs/genjs';
import registerJavascriptBundle from '@genjs/genjs-bundle-javascript';

export default class Plugin implements IPlugin {
    register(generator: IGenerator): void {
        registerJavascriptBundle(generator);
        generator.registerPackager('js-docusaurus', cfg => new Package(cfg));
    }
}
