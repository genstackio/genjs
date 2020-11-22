import Package from './Package';
import {IGenerator, IPlugin} from '@genjs/genjs';

export default class Plugin implements IPlugin {
    register(generator: IGenerator): void {
        generator.registerPackager('terraform-infra', cfg => new Package(cfg));
    }
}
