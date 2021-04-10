import Package from './Package';
import {IGenerator, IPlugin} from '@genjs/genjs';
import registerAwsLambdaBundle from '@genjs/genjs-bundle-aws-lambda';
import registerJavascriptBundle from '@genjs/genjs-bundle-javascript';

export default class Plugin implements IPlugin {
    register(generator: IGenerator): void {
        registerAwsLambdaBundle(generator);
        registerJavascriptBundle(generator);
        generator.registerPackager('js-lambda', cfg => new Package(cfg));
    }
}
