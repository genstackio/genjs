import IPackage from '../IPackage';
import AbstractBehaviour from '../AbstractBehaviour';

export class BuildableBehaviour extends AbstractBehaviour {
    public build(p: IPackage) {
        return {
            features: {
                buildable: true,
            },
        };
    }
}

export default BuildableBehaviour