import YAML from 'yaml';
import IConfigEnhancer from './IConfigEnhancer';

export abstract class AbstractConfigEnhancer implements IConfigEnhancer {
    private readonly assetFetcher: Function;
    private readonly group: string;
    private readonly location: string;
    private readonly options: any;
    protected constructor(getAsset: Function, group: string, location: string, options: any = {}) {
        this.assetFetcher = getAsset;
        this.group = group;
        this.location = location;
        this.options = {parseType: true, ...options};
    }
    enrich(v: any): any {
        let c = v;
        if (this.options.parseType) {
            const [a, b] = this.enhanceConfig(this.location, ...this.parseTypeAndConfigFromRawValue(v));
            c = this.merge(a, b);
        }
        const d = (c.mixins || []).reduce((acc, m) => {
            const [asset, cfg] = this.enhanceConfig(`${this.location}-mixin`, ...this.parseTypeAndConfigFromRawValue(m))
            return this.merge(acc, this.merge(asset, cfg));
        }, {});
        return this.merge(d, c);
    }
    enhance(c: any, type: string) {
        const [asset, cfg] = this.enhanceConfig(this.location, ...this.parseConfigType(c, type));
        return this.merge(asset, cfg);
    }
    protected abstract merge(a: any, b: any);
    // noinspection JSUnusedGlobalSymbols
    protected enhanceConfig(location, type: string|undefined, cfg: any|undefined = {}) {
        cfg = cfg || {};
        if (type) {
            const [rawType, ...mixins] = type.split(/\s*\+\s*/g);
            type = rawType;
            cfg.mixins = this.mergeMixins(cfg.mixins || [], mixins);
        }
        const asset = type ? this.assetFetcher(this.group, `${location}/${type}`) : {};
        cfg.vars = this.prepareVarsFromAssetInputs(cfg.vars || {} , asset.inputs || {});
        return [asset, cfg];
    }
    protected mergeMixins(a: any[] = [], b: any[] = []) {
        const mixins = a.concat(b);
        return mixins.reduce((acc, x) => {
            !acc.includes(x) && (acc.push(x));
            return acc;
        }, <any[]>[]);
    }
    protected mergeVars(a: any = {}, b: any = {}) {
        return {...a, ...b};
    }
    protected parseConfigType = (cfg: any, type: string): [string|undefined, any|undefined] => {
        const match = type.match(/^([^(]+)\(([^)]*)\)$/);
        let parsedVars = {};
        if (!!match && !!match.length) {
            type = match[1];
            parsedVars = !!match[1] ? match[2].split(/\s*,\s*/g).reduce((acc, t) => {
                const [k, v = undefined] = t.split(/\s*=\s*/)
                if (undefined === v) {
                    acc['default'] = k;
                } else {
                    acc[k] = YAML.parse(v || '');
                }
                return acc;
            }, {}) : {};
        }
        cfg = {...cfg, vars: {...parsedVars, ...(cfg.vars || {})}};
        return [type, cfg];
    }
    // noinspection JSUnusedGlobalSymbols
    protected parseTypeAndConfigFromRawValue(v: any): [string|undefined, any|undefined] {
        if ('string' === typeof v) {
            return this.parseConfigType({}, v);
        }
        const {type, ...cfg} = v;
        return type ? this.parseConfigType(cfg, type) : [undefined, cfg];
    }
    protected prepareVarsFromAssetInputs(vars, inputs) {
        return Object.entries(inputs || {}).reduce((acc, [k, v]) => {
            const input = {required: true, type: 'string', ...((null === v || undefined === v) ? {} : <any>v)};
            let value = vars[k] || undefined;
            if (!!input.main && vars.default) value = vars.default;
            (undefined === value) && (value = input.default);
            if ((undefined === value) && input.required) throw new Error(`Required input '${k}' is missing (vars: ${JSON.stringify(vars)}, inputs: ${JSON.stringify(inputs)})`);
            switch (input.type) {
                case 'string': value = String(value); break;
                case 'boolean': value = Boolean(value); break;
                case 'number': value = Number(value); break;
                case 'string[]': value = value.split(/\s*\|\s*/g).map(x => String(x)); break;
                case 'boolean[]': value = value.split(/\s*\|\s*/g).map(x => Boolean(x)); break;
                case 'number[]': value = value.split(/\s*\|\s*/g).map(x => Number(x)); break;
                default: break;
            }
            acc[k] = value;
            return acc;
        }, {});
    }
    protected mergeMapOfLists(a: any = {}, b: any = {}) {
        return Object.keys(b).reduce((acc, k) => {
            acc[k] = acc[k] || [];
            acc[k] = acc[k].concat(b[k] || []);
            return acc;
        }, a);
    }
    protected mergeObjects(a: any = {}, b: any = {}) {
        return {...a, ...b};
    }
    protected mergeListOfStringsOrObjects(a: any[] = [], b: any[] = []) {
        const items = a.concat(b);
        return items.reduce((acc, b) => {
            if ('string' !== typeof b) acc.push(b)
            else if (!acc.includes(b)) acc.push(b);
            return acc;
        }, <any[]>[]);
    }
}

// noinspection JSUnusedGlobalSymbols
export default AbstractConfigEnhancer