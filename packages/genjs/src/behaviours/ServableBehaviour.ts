import IPackage from '../IPackage';
import AbstractBehaviour from '../AbstractBehaviour';

export class ServableBehaviour extends AbstractBehaviour {
    public build(p: IPackage) {
        return {
            features: {
                servable: true,
            },
        };
    }
    buildDynamicVars(p: IPackage, vars: any): any {
        const defaultPort = 8000;
        const port = p.getParameter('port', defaultPort + p.getParameter('startableOrder', 0));
        return {
            servePort: (defaultPort !== port) ? port : undefined,
        };
    }
}

export default ServableBehaviour