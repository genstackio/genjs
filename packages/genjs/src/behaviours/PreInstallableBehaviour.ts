import IPackage from '../IPackage';
import AbstractBehaviour from '../AbstractBehaviour';

export class PreInstallableBehaviour extends AbstractBehaviour {
    public build(p: IPackage) {
        return {
            features: {
                preInstallable: true,
            },
        };
    }
}

export default PreInstallableBehaviour