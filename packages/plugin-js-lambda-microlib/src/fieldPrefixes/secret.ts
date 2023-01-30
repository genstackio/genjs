// noinspection JSUnusedLocalSymbols
function parse(type, tokens, d: any, name: string, schema: any, ctx: any) {
    const [fieldType, path] = tokens;
    d.type = fieldType;
    d.transform = {
        type: '@secret',
        config: {path},
    };
}

export default {
    prefixes: ['secret'],
    parse,
}