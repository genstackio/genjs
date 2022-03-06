// noinspection JSUnusedLocalSymbols
function parse(type, tokens, d: any, name: string, schema: any, ctx: any) {
    const [bucket, key, uploadName = undefined, code = undefined] = tokens;
    d.type = 'css';
    d.config = {bucket, key, name: uploadName || undefined, code, ...(d.config || {})};
}

export default {
    prefixes: ['css'],
    parse,
}