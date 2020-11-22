import IPackage from '../IPackage';
import AbstractBehaviour from '../AbstractBehaviour';

export class InstallableBehaviour extends AbstractBehaviour {
    public build(p: IPackage) {
        return {
            features: {
                installable: true,
            },
        };
    }
}

export default InstallableBehaviour