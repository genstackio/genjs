import Handler from './Handler';
import MicroserviceType from './MicroserviceType';
import Package from './Package';
import MicroserviceConfigEnhancer from "./configEnhancers/MicroserviceConfigEnhancer";
import MicroserviceTypeConfigEnhancer from "./configEnhancers/MicroserviceTypeConfigEnhancer";

export type MicroserviceConfig = {
    name: string,
    types?: any,
    handlers?: any,
    type?: string,
};

export default class Microservice {
    public readonly name: string;
    public readonly types: {[key: string]: MicroserviceType} = {};
    public readonly handlers: {[key: string]: Handler} = {};
    public readonly package: Package;
    constructor(pkg: Package, c: MicroserviceConfig) {
        this.package = pkg;
        const configEnhancer = new MicroserviceConfigEnhancer(this.package.getAsset.bind(this.package))
        const {name, types = {}, handlers = {}} = c.type ? configEnhancer.enhance(c, c.type) : c;
        this.name = name;
        Object.entries(types).forEach(
            ([name, c]: [string, any]) => {
                const typeConfigEnhancer = new MicroserviceTypeConfigEnhancer(this.package.getAsset.bind(this.package))
                c = typeConfigEnhancer.enrich({...((null === c || undefined === c || !c) ? {} : (('string' === typeof c) ? {type: c} : c))});
                this.types[name] = new MicroserviceType(this, {
                    microservice: this,
                    name,
                    ...c,
                });
            }
        );
        const opNames = Object.entries(this.types).reduce((acc, [n, t]) =>
            Object.keys(t.operations).reduce((acc2, n2) => {
                acc2.push(`${n}_${n2}`);
                return acc2;
            }, acc)
        , <string[]>[]);
        opNames.sort();
        Object.entries(handlers).forEach(
            ([name, c]: [string, any]) =>
                this.handlers[name] = new Handler({name: `${this.name}${'handler' === name ? '' : `_${name}`}`, ...c, directory: 'handlers', vars: {...(c.vars || {}), operations: opNames, prefix: this.name}})
        );
    }
    async generate(vars: any = {}): Promise<{[key: string]: Function}> {
        return (await Promise.all(Object.values(this.types).map(
            async o => o.generate(vars)))).reduce((acc, r) =>
                Object.assign(acc, r),
            (await Promise.all(Object.values(this.handlers).map(async h => h.generate(vars)))).reduce((acc, ff) => Object.assign(acc, ff), {})
        );
    }
}