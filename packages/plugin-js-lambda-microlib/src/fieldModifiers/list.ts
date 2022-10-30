// noinspection JSUnusedLocalSymbols
export function parse(d: any, name: string, schema: any, ctx: any) {
    if (!/\[]$/.test(d.type)) return;

    d.list = true;
    d.type = d.type.slice(0, d.type.length - 2);
}

export default {priority: 20, parse}