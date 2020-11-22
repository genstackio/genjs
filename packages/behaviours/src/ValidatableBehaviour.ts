import {IPackage, AbstractBehaviour} from "@genjs/genjs";

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