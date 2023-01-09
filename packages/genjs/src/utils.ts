import ejs from 'ejs';
const fs = require('fs');
import stringifyObject from 'stringify-object';
import YAML from 'yaml';
const fse = require('fs-extra');
const path = require('path');

export const jsStringify = (o, inline = false, indentSize = 4) => stringifyObject(o, {indent: ''.padEnd(indentSize), singleQuotes: true, inlineCharacterLimit: 'number' !== typeof inline ? undefined : inline});
export const indent = (t, offset = 4) => (t || '').split(/\n/g).map(x => `${x ? ''.padEnd(offset) : ''}${x}`).join("\n");
export const render = (string, vars = {}, options = {}) => ejs.render(string, {indent, jsStringify, ...vars}, options);
export const renderFile = ({templatePath}) => (path, vars = {}) => {
    const filename = `${templatePath}/${path}`;
    return render(fs.readFileSync(filename, 'utf8'), vars, {filename});
};
export const copy = (source, target) => {
    fse.copySync(source, target);
    return true;
};
export const writeFile = (target, content) => {
    fs.mkdirSync(path.dirname(target), {recursive: true});
    fs.writeFileSync(target, content);
    return true;
};
export const populateData = (o, d) => {
    return Object.entries(d || {}).reduce((acc, [k, v]) => {
        if ('undefined' === typeof acc[k]) {
            acc[k] = v;
        } else {
            if (Array.isArray(v)) {
                if (Array.isArray(acc[k])) {
                    v.forEach(vv => acc[k].push(vv));
                } else {
                    acc[k] = v;
                }
            } else {
                if ((null !== v) && ('object' === typeof v)) {
                    if ((null !== acc[k]) && ('object' === typeof acc[k])) {
                        Object.assign(acc[k], v);
                    } else {
                        acc[k] = v;
                    }
                } else {
                    // stay inchanged
                }
            }
        }
        return acc;
    }, o);
};
export const mergeData = (a, b) => {
    return populateData({...a}, b);
}
export const parseYaml = x => YAML.parse(x);

export function replaceVarValueIfNeeded(value: any) {
    if ('string' !== typeof value) return value;
    switch (value) {
        case '$now.time': return 'new Date().getTime()';
        case '$now': return 'new Date()';
        case '$now.iso': return 'new Date().toISOString()';
        default: return value;
    }
}

export function parseConfigType(cfg: any, type: string|undefined): [string|undefined, any|undefined] {
    const match = (type || '').match(/^([^(]+)\(([^)]*)\)$/);
    let parsedVars = {};
    if (!!match && !!match.length) {
        type = match[1];
        parsedVars = !!match[1] ? match[2].split(/\s*,\s*/g).reduce((acc, t) => {
            const [k, v = undefined] = t.split(/\s*=\s*/)
            if (undefined === v) {
                acc['default'] = replaceVarValueIfNeeded(k);
            } else {
                acc[k] = replaceVarValueIfNeeded(YAML.parse(v || ''));
            }
            return acc;
        }, {}) : {};
    }
    cfg = {...cfg, vars: {...parsedVars, ...(cfg.vars || {})}};
    return [type, cfg];

}