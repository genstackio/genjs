// noinspection JSUnusedLocalSymbols
function parse(type, tokens, d: any, name: string, schema: any, ctx: any) {
    /**
     * Here are the 2 available syntaxes:
     *
     * * Syntax #1: the short syntax
     *
     * ==> favoriteCount: stat:count:user_favorite_create[user]=@inc,user_favorite_delete[user]=@dec
     *
     * * Syntax #2: the full syntax
     *
     * ==>
     *
     * favoriteCount:
     *     type: stat
     *     config:
     *         type: count
     *         track:
     *             - {on: user_favorite_create, join: user, action: {type: @inc}}
     *             - {on: user_favorite_delete, join: user, action: {type: @dec}}
     */
    const [statType, ...items] = tokens;
    d.config = (d.config || {});
    d.config.type = statType;
    d.config.track = d.config.track || [];
    const z = {type, name, schema, ctx};
    items.reduce((acc, item) => {
        acc.config.track.push(buildTrackerFromString(item, z));
        return acc;
    }, d);
    d.type = 'stat';
}

function buildTrackerFromString(def: string, {name, schema}) {
    const match: null|{groups?: {on: string, join: string, action: string}} = def.match(/^(?<on>[^\[]+)\[(?<join>[^\]]+)\]=(?<action>.+)$/) as any;
    if (!match || !match.groups) throw new Error(`Unsupported stat tracker definition for ${schema.name}.${name}: ${def}`)
    return {
        on: match.groups.on,
        join: match.groups.join,
        action: parseAction(match.groups.action),
    }
}

function parseAction(def: string) {
    return {type: def};
}

export default {
    prefixes: ['stat'],
    parse,
}