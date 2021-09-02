import Package from './Package';
import {IGenerator, IPlugin} from '@genjs/genjs';
import registerTerraformBundle from '@genjs/genjs-bundle-terraform';
import registerJavascriptBundle from '@genjs/genjs-bundle-javascript';
import registerScmBundle from '@genjs/genjs-bundle-scm';

export default class Plugin implements IPlugin {
    register(generator: IGenerator): void {
        registerTerraformBundle(generator);
        registerJavascriptBundle(generator);
        registerScmBundle(generator);
        generator.registerPackager('monorepo-terraform-modules', cfg => new Package(cfg));
    }
}
