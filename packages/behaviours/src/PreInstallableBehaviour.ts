import {IPackage, AbstractBehaviour} from "@genjs/genjs";

export class PreInstallableBehaviour extends AbstractBehaviour {
    public build(p: IPackage) {
        return {
            features: {
                preInstallable: true,
            },
        };
    }
}

export default PreInstallableBehaviour