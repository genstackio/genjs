// noinspection JSUnusedLocalSymbols
function parse(type, tokens, d: any, name: string, schema: any, ctx: any) {
    const [bucket, key, uploadName = undefined] = tokens;
    d.type = 'image';
    d.config = {bucket, key, name: uploadName, ...(d.config || {})};
}

export default {
    prefixes: ['image'],
    parse,
}