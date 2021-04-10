import Package from './Package';
import {IGenerator, IPlugin} from '@genjs/genjs';
import registerAwsLambdaBundle from '@genjs/genjs-bundle-aws-lambda';
import registerTypescriptBundle from '@genjs/genjs-bundle-typescript';

export default class Plugin implements IPlugin {
    register(generator: IGenerator): void {
        registerAwsLambdaBundle(generator);
        registerTypescriptBundle(generator);
        generator.registerPackager('ts-lambda', cfg => new Package(cfg));
    }
}
