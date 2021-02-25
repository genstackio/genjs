// noinspection JSUnusedLocalSymbols
function parse(type, tokens, d: any, name: string, schema: any, ctx: any) {
    const [parentField, sourceField, format = 'string'] = tokens;
    const sources: {parentField: string, sourceField: string, field: string}[] = [];
    if (-1 !== parentField.indexOf(',')) {
        const xx = parentField.split(',');
        const yy = sourceField.split(',');
        xx.forEach((x, i) => {
            sources.push({parentField: x, sourceField: (i < yy.length) ? yy[i] : yy[yy.length - 1], field: name});
        });
    } else {
        sources.push({parentField, sourceField, field: name});
    }
    d.refAttribute = (sources.length > 1) ? sources : sources[0];
    applyFormat(format, d);
}

function applyFormat(format, d: any) {
    switch (format) {
        case 'number':
            d.type = 'number';
            break;
        case 'lower':
            d.type = 'string';
            d.lower = true;
            break;
        case 'upper':
            d.type = 'string';
            d.upper = true;
            break;
        case 'string':
            d.type = 'string';
            break;
        case 'list':
            d.type = 'string';
            d.list = true;
            d.transform = {type: '@list'};
            break;
        default:
            if ('t>' === format.slice(0, 2)) {
                d.transform = [...(d.transform ? (Array.isArray(d.transform) ? d.transform : [d.transform]) : []), {type: format.slice(2)}];
            }
            d.type = 'string';
            break;
    }
}

export default {
    prefixes: ['refattr'],
    parse,
}