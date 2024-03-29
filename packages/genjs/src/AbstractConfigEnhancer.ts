import IConfigEnhancer from './IConfigEnhancer';
import ejs from 'ejs';
import {parseConfigType} from "./utils";

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
            let [asset, cfg] = this.enhanceConfig(`${this.location}-mixin`, ...this.parseTypeAndConfigFromRawValue(m))
            if (!!Object.keys(cfg.vars || {}).length) {
                const {attributesPrefix: vAttributesPrefix, operationsPrefix: vOperationsPrefix, functionsPrefix: vFunctionsPrefix, attributesSuffix: vAttributesSuffix, operationsSuffix: vOperationsSuffix, functionsSuffix: vFunctionsSuffix, attributes: vAttributes, operations: vOperations, functions: vFunctions, vars: vVars} = Object.entries(cfg.vars).reduce((acc, [k, v]: [string, any]) => {
                    if ('_attributes' === k) {
                        acc.attributes = v;
                    } else if ('_attributesPrefix' === k) {
                        acc.attributesPrefix = v;
                    } else if ('_attributesSuffix' === k) {
                        acc.attributesSuffix = v;
                    } else if ('_operations' === k) {
                        acc.operations = v;
                    } else if ('_operationsPrefix' === k) {
                        acc.operationsPrefix = v;
                    } else if ('_operationsSuffix' === k) {
                        acc.operationsSuffix = v;
                    } else if ('_functions' === k) {
                        acc.functions = v;
                    } else if ('_functionsPrefix' === k) {
                        acc.functionsPrefix = v;
                    } else if ('_functionsSuffix' === k) {
                        acc.functionsSuffix = v;
                    } else {
                        acc.vars[k] = v;
                    }
                    return acc;
                }, {attributesPrefix: undefined, operationsPrefix: undefined, functionsPrefix: undefined, attributesSuffix: undefined, operationsSuffix: undefined, functionsSuffix: undefined, attributes: {}, operations: {}, functions: {}, vars: {}} as {attributesPrefix?: string, operationsPrefix?: string, functionsPrefix?: string, attributesSuffix?: string, operationsSuffix?: string, functionsSuffix?: string, attributes: Record<string, string>, operations: Record<string, string>, functions: Record<string, string>, vars: Record<string, any>});
                asset = (!vAttributesPrefix || !asset?.attributes) ? asset : this.recursived(asset, 'attributes', k => `${vAttributesPrefix}${k.slice(0, 1).toUpperCase()}${k.slice(1)}`);
                asset = (!vAttributesSuffix || !asset?.attributes) ? asset : this.recursived(asset, 'attributes', k => `${k}${vAttributesSuffix.slice(0, 1).toUpperCase()}${vAttributesSuffix.slice(1)}`);
                asset = (!vOperationsPrefix || !asset?.operations) ? asset : this.recursived(asset, 'operations', k => `${vOperationsPrefix}${k.slice(0, 1).toUpperCase()}${k.slice(1)}`);
                asset = (!vOperationsSuffix || !asset?.operations) ? asset : this.recursived(asset, 'operations', k => `${k}${vOperationsSuffix.slice(0, 1).toUpperCase()}${vOperationsSuffix.slice(1)}`);
                asset = (!vFunctionsPrefix || !asset?.functions) ? asset : this.recursived(asset, 'functions', k => `${vFunctionsPrefix}${k.slice(0, 1).toUpperCase()}${k.slice(1)}`);
                asset = (!vFunctionsSuffix || !asset?.functions) ? asset : this.recursived(asset, 'functions', k => `${k}${vFunctionsSuffix.slice(0, 1).toUpperCase()}${vFunctionsSuffix.slice(1)}`);
                asset = Object.entries(vAttributes).reduce((acc, [k, v]: [string, string]) => {
                    if ((!asset?.attributes || {})[k]) return acc;
                    acc.attributes[v] = acc.attributes[k];
                    delete acc.attributes[k];
                    return acc;
                }, asset);
                asset = Object.entries(vOperations).reduce((acc, [k, v]: [string, string]) => {
                    if ((!asset?.operations || {})[k]) return acc;
                    acc.operations[v] = acc.operations[k];
                    delete acc.operations[k];
                    return acc;
                }, asset);
                asset = Object.entries(vFunctions).reduce((acc, [k, v]: [string, string]) => {
                    if ((!asset?.functions || {})[k]) return acc;
                    acc.functions[v] = acc.functions[k];
                    delete acc.functions[k];
                    return acc;
                }, asset);
                asset = this.replaceVarsRecursive(asset, vVars);
            }
            return this.merge(acc, this.merge(asset, cfg));
        }, {});
        return this.merge(d, c);
    }
    protected recursived(a: any, key: string, map: Function) {
        const mapping = Object.entries(a[key] || {}).reduce((acc, [k]) => {
            acc[k] = map(k);
            return acc;
        }, {} as any);
        return Object.entries(a[key] || {}).reduce((acc, [k, v]) => {
            delete acc[key][k];
            acc[key][mapping[k]] = this.recursiveStringReplaces(v, mapping);
            return acc;
        }, a)
    }
    protected recursiveStringReplaces(a: any, mapping: any) {
        return Object.entries(mapping).reduce((acc: any, [k, v]: [string, any]) => {
            return this.recursiveStringReplace(acc, k, v);
        }, a as any);
    }
    protected recursiveStringReplace(v: any, a: string, b: string) {
        if (!v) return v;
        if (Array.isArray(v)) return v.map(x => this.recursiveStringReplace(x, a, b));
        if ('object' === typeof v) return Object.entries(v).reduce((acc, [kk, vv]) => {
            delete acc[kk];
            acc[this.recursiveStringReplace(kk, a, b)] = this.recursiveStringReplace(vv, a, b);
            return acc;
        }, {} as any);
        if ('string' === typeof v) return v.replace(new RegExp(a, 'g'), b);
        return v;
    }
    protected replaceVarsRecursive(data: any, vars: any) {
        if (!data) return data;
        if ('string' === typeof data) {
            try {
                return ejs.render(data, vars);
            } catch (e: any) {
                throw new Error(`EJS template rendering error in template [${data}]: ${e.message}, with vars: ${JSON.stringify(vars)}`);
            }
        }
        if ('boolean' === typeof data) return data;
        if ('number' === typeof data) return data;
        if ('object' === typeof data) {
            if (Array.isArray(data)) return data.map(x => this.replaceVarsRecursive(x, vars));
            return Object.entries(data).reduce((acc, [k, v]) => {
                acc[this.replaceVarsRecursive(k, vars)] = this.replaceVarsRecursive(v, vars);
                return acc;
            }, {});
        }
        return data;
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
    protected parseConfigType(cfg: any, type: string): [string|undefined, any|undefined] {
        return parseConfigType(cfg, type);
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
        const vv = Object.entries(vars || {}).reduce((acc, [k, v]) => {
                if ('@' === k.slice(0, 1)) {
                    if ('@prefix@' === k) {
                        acc['_attributesPrefix'] = v;
                    } else if ('@suffix@' === k) {
                        acc['_attributesSuffix'] = v;
                    } else {
                        acc['_attributes'] = acc['_attributes'] || {};
                        acc['_attributes'][k.slice(1)] = v;
                    }
                }
                if ('%' === k.slice(0, 1)) {
                    if ('%prefix%' === k) {
                        acc['_operationsPrefix'] = v;
                    } else if ('%suffix%' === k) {
                        acc['_operationsSuffix'] = v;
                    } else {
                        acc['_operations'] = acc['_operations'] || {};
                        acc['_operations'][k.slice(1)] = v;
                    }
                }
                if (':' === k.slice(0, 1)) {
                    if (':prefix:' === k) {
                        acc['_functionsPrefix'] = v;
                    } else if (':suffix:' === k) {
                        acc['_functionsSuffix'] = v;
                    } else {
                        acc['_functions'] = acc['_functions'] || {};
                        acc['_functions'][k.slice(1)] = v;
                    }
                }
                return acc;
        }, {});
        return Object.entries(inputs || {}).reduce((acc, [k, v]) => {
            const input = {required: true, type: 'string', ...((null === v || undefined === v) ? {} : <any>v)};
            let value = vars[k];
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
        }, vv);
    }
    protected mergeMapOfLists(a: any = {}, b: any = {}) {
        return Object.keys(b).reduce((acc, k) => {
            acc[k] = [...(acc[k] || [])];
            acc[k] = acc[k].concat(b[k] || []);
            return acc;
        }, {...a});
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