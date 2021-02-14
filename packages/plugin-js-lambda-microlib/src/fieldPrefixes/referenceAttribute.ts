// noinspection JSUnusedLocalSymbols
function parse(type, tokens, d: any, name: string, schema: any, ctx: any) {
    const [parentField, sourceField] = tokens;
    d.refAttribute = {
        parentField,
        sourceField,
        field: name,
    };
    d.type = 'string';
}

export default {
    prefixes: ['refattr'],
    parse,
}