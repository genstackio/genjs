// noinspection JSUnusedLocalSymbols
function parse(type, tokens, d: any, name: string, schema: any, ctx: any) {
    d.ownedReferenceList = {
        type: ctx.buildTypeName(tokens[0], schema.name),
        ...buildParentIdFieldInfos(tokens[1], schema),
    };
    d.type = 'object';
    d['list'] = true;
}

function buildParentIdFieldInfos(parentIdField: string|undefined = undefined, schema) {
    return parentIdField || schema.shortName;
}

export default {
    prefixes: ['reflist'],
    parse,
}