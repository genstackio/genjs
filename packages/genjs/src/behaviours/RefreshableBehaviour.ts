import IPackage from '../IPackage';
import AbstractBehaviour from '../AbstractBehaviour';

export class RefreshableBehaviour extends AbstractBehaviour {
    public build(p: IPackage) {
        return {
            features: {
                refreshable: true,
            },
        };
    }
}

export default RefreshableBehaviour