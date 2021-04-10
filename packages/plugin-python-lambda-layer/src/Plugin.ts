import {IGenerator, IPlugin} from '@genjs/genjs';
import Package from './Package';
import registerAwsLambdaLayerBundle from '@genjs/genjs-bundle-aws-lambda-layer';
import registerPythonBundle from '@genjs/genjs-bundle-python';

export default class Plugin implements IPlugin {
    register(generator: IGenerator): void {
        registerAwsLambdaLayerBundle(generator);
        registerPythonBundle(generator);
        generator.registerPackager('python-lambda-layer', cfg => new Package(cfg));
    }
}