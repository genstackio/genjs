import Package from './Package';
import {IGenerator, IPlugin} from '@genjs/genjs';
import registerTerraformBundle from '@genjs/genjs-bundle-terraform';
import registerJavascriptBundle from '@genjs/genjs-bundle-javascript';

export default class Plugin implements IPlugin {
    register(generator: IGenerator): void {
        registerTerraformBundle(generator);
        registerJavascriptBundle(generator);
        generator.registerPackager('monorepo-terraform-modules', cfg => new Package(cfg));
    }
}
