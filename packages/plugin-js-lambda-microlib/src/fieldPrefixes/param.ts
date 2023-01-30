// noinspection JSUnusedLocalSymbols
function parse(type, tokens, d: any, name: string, schema: any, ctx: any) {
    const [fieldType, path] = tokens;
    d.type = fieldType;
    d.transform = {
        type: '@param',
        config: {path},
    };
}

export default {
    prefixes: ['param'],
    parse,
}