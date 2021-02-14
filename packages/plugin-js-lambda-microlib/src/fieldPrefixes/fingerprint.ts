// noinspection JSUnusedLocalSymbols
function parse(type, tokens, d: any, name: string, schema: any, ctx: any) {
    let [fields, algorithm = undefined] = tokens;
    fields = fields.split(/\s*,\s*/g);
    d.requires = d.requires || [];
    d.requires = Array.isArray(d.requires) ? d.requires : [d.requires];
    d.requires = [...d.requires, ...fields];
    d.requires = Object.keys(d.requires.reduce((acc, k) => {
        acc[k] = true;
        return acc;
    }, {} as any));
    d.populate = {type: '@fingerprint', config: {fields, algorithm}};
    d.type = 'string';
}

export default {
    prefixes: ['fingerprint'],
    parse,
}