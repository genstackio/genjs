import {IGenerator, IPlugin} from '@genjs/genjs';
import Package from './Package';
import registerAwsLambdaBundle from '@genjs/genjs-bundle-aws-lambda';
import registerGoBundle from '@genjs/genjs-bundle-go';

export default class Plugin implements IPlugin {
    register(generator: IGenerator): void {
        registerAwsLambdaBundle(generator);
        registerGoBundle(generator);
        generator.registerPackager('go-lambda', cfg => new Package(cfg));
    }
}