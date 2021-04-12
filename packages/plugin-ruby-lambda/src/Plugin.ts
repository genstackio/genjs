import {IGenerator, IPlugin} from '@genjs/genjs';
import Package from './Package';
import registerAwsLambdaBundle from '@genjs/genjs-bundle-aws-lambda';
import registerRubyBundle from '@genjs/genjs-bundle-ruby';

export default class Plugin implements IPlugin {
    register(generator: IGenerator): void {
        registerAwsLambdaBundle(generator);
        registerRubyBundle(generator);
        generator.registerPackager('ruby-lambda', cfg => new Package(cfg));
    }
}