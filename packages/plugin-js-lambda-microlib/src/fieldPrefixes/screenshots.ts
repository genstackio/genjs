// noinspection JSUnusedLocalSymbols
function parse(type, tokens, d: any, name: string, schema: any, ctx: any) {
    const [kind, key] = tokens;
    d.type = 'screenshots';
    d.config = {kind, key, ...(d.config || {})};
}

export default {
    prefixes: ['screenshots'],
    parse,
}