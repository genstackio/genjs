import {IGenerator, IPlugin} from '@genjs/genjs';
import Package from './Package';
import registerAwsLambdaBundle from '@genjs/genjs-bundle-aws-lambda';
import registerJavaBundle from '@genjs/genjs-bundle-java';

export default class Plugin implements IPlugin {
    register(generator: IGenerator): void {
        registerAwsLambdaBundle(generator);
        registerJavaBundle(generator);
        generator.registerPackager('java-lambda', cfg => new Package(cfg));
    }
}