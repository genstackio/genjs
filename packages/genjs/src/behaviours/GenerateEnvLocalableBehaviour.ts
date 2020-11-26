import IPackage from '../IPackage';
import AbstractBehaviour from '../AbstractBehaviour';

export class GenerateEnvLocalableBehaviour extends AbstractBehaviour {
    public build(p: IPackage) {
        return {
            features: {
                generateEnvLocalable: true,
            },
        };
    }
}

export default GenerateEnvLocalableBehaviour