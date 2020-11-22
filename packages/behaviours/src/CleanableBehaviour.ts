import {IPackage, AbstractBehaviour} from "@genjs/genjs";

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