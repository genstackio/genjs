import IPackage from '../IPackage';
import AbstractBehaviour from '../AbstractBehaviour';

export class ValidatableBehaviour extends AbstractBehaviour {
    public build(p: IPackage) {
        return {
            features: {
                validatable: true,
            },
        };
    }
}

export default ValidatableBehaviour