// noinspection JSUnusedLocalSymbols
export function internal(d: any, name: string, schema: any, ctx: any) {
    if (!/^:/.test(d.type)) return;

    d.internal = true;
    d.type = d.type.substr(1);
}

export default internal