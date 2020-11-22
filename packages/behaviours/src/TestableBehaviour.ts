import {IPackage, AbstractBehaviour} from "@genjs/genjs";

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