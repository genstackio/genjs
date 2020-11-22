import {IGenerator, IPlugin} from '@genjs/genjs';

export default class Plugin implements IPlugin {
    register(generator: IGenerator): void {
        generator.registerRegistry('directory', {path: `${__dirname}/../assets`});
    }
}
