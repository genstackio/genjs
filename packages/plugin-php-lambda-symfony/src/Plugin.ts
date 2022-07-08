import Package from './Package';
import {IGenerator, IPlugin} from '@genjs/genjs';
import registerAwsLambdaBundle from '@genjs/genjs-bundle-aws-lambda';
import registerPhpBundle from '@genjs/genjs-bundle-php';
import registerJsBundle from '@genjs/genjs-bundle-javascript';

export default class Plugin implements IPlugin {
    register(generator: IGenerator): void {
        registerAwsLambdaBundle(generator);
        registerJsBundle(generator);
        registerPhpBundle(generator);
        generator.registerPackager('php-lambda-symfony', cfg => new Package(cfg));
    }
}
