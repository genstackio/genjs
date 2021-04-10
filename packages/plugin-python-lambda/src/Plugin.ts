import {IGenerator, IPlugin} from '@genjs/genjs';
import Package from './Package';
import registerAwsLambdaBundle from '@genjs/genjs-bundle-aws-lambda';
import registerPythonBundle from '@genjs/genjs-bundle-python';

export default class Plugin implements IPlugin {
    register(generator: IGenerator): void {
        registerAwsLambdaBundle(generator);
        registerPythonBundle(generator);
        generator.registerPackager('python-lambda', cfg => new Package(cfg));
    }
}