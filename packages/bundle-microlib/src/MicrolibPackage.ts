import {BasePackage} from '@genjs/genjs-bundle-package';

export class MicrolibPackage extends BasePackage {
    protected getTechnologies() {
        return [
            ...super.getTechnologies(),
            'node',
            'es6',
        ];
    }
}

export default MicrolibPackage
