import {IPackage, AbstractBehaviour} from "@genjs/genjs";

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