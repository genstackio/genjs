import IPackage from '../IPackage';
import AbstractBehaviour from '../AbstractBehaviour';

export class TestableBehaviour extends AbstractBehaviour {
    public build(p: IPackage) {
        return {
            features: {
                testable: true,
            },
        };
    }
}

export default TestableBehaviour