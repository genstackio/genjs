import IPackage from '../IPackage';
import AbstractBehaviour from '../AbstractBehaviour';

export class LoggableBehaviour extends AbstractBehaviour {
    public build(p: IPackage) {
        return {
            features: {
                loggable: true,
            },
        };
    }
}

export default LoggableBehaviour