import Package from './Package';
import {IGenerator, IPlugin} from '@genjs/genjs';
import registerAwsLambdaLayerBundle from '@genjs/genjs-bundle-aws-lambda-layer';

export default class Plugin implements IPlugin {
    register(generator: IGenerator): void {
        registerAwsLambdaLayerBundle(generator);
        generator.registerPackager('any-lambda-layer', cfg => new Package(cfg));
    }
}
