// noinspection JSUnusedLocalSymbols
function parse(type, tokens, d: any, name: string, schema: any, ctx: any) {
    const [uploadName = undefined, code = undefined, prefix = undefined, idField = undefined, tokenField = undefined] = tokens;
    d.type = 'chart';
    d.config = {name: uploadName || undefined, code, imageCode: code, prefix, idField, tokenField, ...(d.config || {})};
}

export default {
    prefixes: ['chart'],
    parse,
}