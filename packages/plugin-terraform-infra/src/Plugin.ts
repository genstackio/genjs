import Package from './Package';
import {IGenerator, IPlugin} from '@genjs/genjs';
import registerTerraformBundle from '@genjs/genjs-bundle-terraform';

export default class Plugin implements IPlugin {
    register(generator: IGenerator): void {
        registerTerraformBundle(generator);
        generator.registerPackager('terraform-infra', cfg => new Package(cfg));
    }
}
