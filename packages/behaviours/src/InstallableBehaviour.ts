import {IPackage, AbstractBehaviour} from "@genjs/genjs";

export class InstallableBehaviour extends AbstractBehaviour {
    public build(p: IPackage) {
        return {
            features: {
                installable: true,
            },
        };
    }
}

export default InstallableBehaviour