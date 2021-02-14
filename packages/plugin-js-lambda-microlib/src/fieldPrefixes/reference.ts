// noinspection JSUnusedLocalSymbols
function parse(type, tokens, d: any, name: string, schema: any, ctx: any) {
    d.reference = {
        reference: tokens[0],
        ...buildIdFieldInfos(tokens[1]),
        fetchedFields: [],
    };
    d.type = 'string';
}

function buildIdFieldInfos(idField: string|string[] = 'id') {
    idField = ('string' === typeof idField) ? idField.split(/\s*,\s*/g) : idField;
    let targetIdFieldIndex = idField.findIndex(x => '*' === (x.slice(x.length - 1, x.length)));
    if (-1 < targetIdFieldIndex) {
        idField[targetIdFieldIndex] = idField[targetIdFieldIndex].slice(0, idField[targetIdFieldIndex].length - 1);
    } else {
        targetIdFieldIndex = 0;
    }
    const targetIdField = idField[targetIdFieldIndex];
    (1 === idField.length) && (idField = idField[0]);
    const infos = {idField};
    ('string' !== typeof idField) && (infos['targetIdField'] = targetIdField);
    return infos;
}


export default {
    prefixes: ['ref'],
    parse,
}