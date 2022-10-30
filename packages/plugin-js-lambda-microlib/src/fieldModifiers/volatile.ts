// noinspection JSUnusedLocalSymbols
export function parse(d: any, name: string, schema: any, ctx: any) {
    if (!/^#/.test(d.type)) return;

    d.volatile = true;
    d.type = d.type.slice(1);
}

export default {priority: 50, parse}