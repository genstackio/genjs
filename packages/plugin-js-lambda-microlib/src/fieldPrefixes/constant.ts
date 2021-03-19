// noinspection JSUnusedLocalSymbols
function parse(type, tokens, d: any, name: string, schema: any, ctx: any) {
    let {values, defaultValue} = tokens[0].split(/\s*,\s*/g).reduce((acc, v) => {
        if ('*' === v.slice(-1)) {
            v = v.slice(0, v.length - 1);
            acc.defaultValue = v;
        }
        acc.values.push(v);
        return acc;
    }, {values: [], defaultValue: undefined} as {values: string[], defaultValue: string|undefined});
    d.type = 'constant';
    (undefined !== defaultValue) && (d.default = defaultValue);
    d.config = d.config || {};
    d.config['values'] = values;
}

export default {
    prefixes: ['const'],
    parse,
}