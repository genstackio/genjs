import {IGenerator, IPlugin} from '@genjs/genjs';
import Package from './Package';
import registerPythonBundle from '@genjs/genjs-bundle-python';

export default class Plugin implements IPlugin {
    register(generator: IGenerator): void {
        registerPythonBundle(generator);
        generator.registerPackager('python-package', cfg => new Package(cfg));
    }
}
