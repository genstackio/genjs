// noinspection JSUnusedLocalSymbols
export function parse(d: any, name: string, schema: any, ctx: any) {
    if (!/^@/.test(d.type)) return;

    d.type = d.type.slice(1);
    d.index.push({name});
}

export default {priority: 60, parse}