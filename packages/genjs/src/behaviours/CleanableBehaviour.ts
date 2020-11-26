import IPackage from '../IPackage';
import AbstractBehaviour from '../AbstractBehaviour';

export class CleanableBehaviour extends AbstractBehaviour {
    public build(p: IPackage) {
        return {
            features: {
                cleanable: true,
            },
        };
    }
}

export default CleanableBehaviour