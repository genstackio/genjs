import Package from './Package';
import {IGenerator, IPlugin} from '@genjs/genjs';
import registerAwsLambdaBundle from '@genjs/genjs-bundle-aws-lambda';
import registerPhpBundle from '@genjs/genjs-bundle-php';

export default class Plugin implements IPlugin {
    register(generator: IGenerator): void {
        registerAwsLambdaBundle(generator);
        registerPhpBundle(generator);
        generator.registerPackager('php-lambda-symfony', cfg => new Package(cfg));
    }
}
