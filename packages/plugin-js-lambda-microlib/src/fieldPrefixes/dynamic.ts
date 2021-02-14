// noinspection JSUnusedLocalSymbols
function parse(type, tokens, d: any, name: string, schema: any, ctx: any) {
    const [dynType, ...extraTokens] = tokens;
    switch (type) {
        case 'dyn':
            d.dynamic = {type: dynType, config: {[dynType.replace(/^@/, '')]: extraTokens.join(':')}};
            d.type = 'string';
            break;
        case 'dyn_o':
            d.dynamic = {type: dynType, config: {[dynType.replace(/^@/, '')]: extraTokens.join(':')}};
            d.type = 'object';
            break;
        case 'dyn_b':
            d.dynamic = {type: dynType, config: {[dynType.replace(/^@/, '')]: extraTokens.join(':')}};
            d.type = 'boolean';
            break;
        case 'dyn_n':
            d.dynamic = {type: dynType, config: {[dynType.replace(/^@/, '')]: extraTokens.join(':')}};
            d.type = 'number';
            break;
        case 'dyn_a':
            d.dynamic = {type: dynType, config: {[dynType.replace(/^@/, '')]: extraTokens.join(':')}};
            d.type = 'string';
            d.list = true;
            break;
        case 'dyn_ao':
            d.dynamic = {type: dynType, config: {[dynType.replace(/^@/, '')]: extraTokens.join(':')}};
            d.type = 'object';
            d.list = true;
            break;
        case 'dyn_ab':
            d.dynamic = {type: dynType, config: {[dynType.replace(/^@/, '')]: extraTokens.join(':')}};
            d.type = 'boolean';
            d.list = true;
            break;
        case 'dyn_an':
            d.dynamic = {type: dynType, config: {[dynType.replace(/^@/, '')]: extraTokens.join(':')}};
            d.type = 'number';
            d.list = true;
            break;
    }
}

export default {
    prefixes: ['dyn', 'dyn_o', 'dyn_b', 'dyn_n', 'dyn_a', 'dyn_ao', 'dyn_ab', 'dyn_an'],
    parse,
}