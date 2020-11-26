import IPackage from '../IPackage';
import AbstractBehaviour from '../AbstractBehaviour';

export class DeployableBehaviour extends AbstractBehaviour {
    public build(p: IPackage) {
        return {
            features: {
                deployable: true,
            },
        };
    }
}

export default DeployableBehaviour