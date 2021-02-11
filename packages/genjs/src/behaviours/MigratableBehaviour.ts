import IPackage from '../IPackage';
import AbstractBehaviour from '../AbstractBehaviour';

export class MigratableBehaviour extends AbstractBehaviour {
    public build(p: IPackage) {
        return {
            features: {
                migratable: true,
            },
        };
    }
}

export default MigratableBehaviour