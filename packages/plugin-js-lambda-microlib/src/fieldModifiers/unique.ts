// noinspection JSUnusedLocalSymbols
export function unique(d: any, name: string, schema: any, ctx: any) {
    if (!/^!/.test(d.type)) return;

    d.unique = true;
    d.type = d.type.substr(1);
}

export default unique