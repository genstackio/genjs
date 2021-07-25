import {CommandInitializer} from '@genjs/genjs';

export class NpxInitializer extends CommandInitializer {
    constructor(name: string, args: string[] = [], options: any = {}) {
        super(['npx', name, ...args], options);
    }
}

export default NpxInitializer