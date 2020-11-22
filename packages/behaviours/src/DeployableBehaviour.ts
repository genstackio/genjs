import {IPackage, AbstractBehaviour} from "@genjs/genjs";

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