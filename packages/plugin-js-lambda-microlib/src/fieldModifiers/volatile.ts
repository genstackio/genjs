// noinspection JSUnusedLocalSymbols
export function volatile(d: any, name: string, schema: any, ctx: any) {
    if (!/^#/.test(d.type)) return;

    d.volatile = true;
    d.type = d.type.substr(1);
}

export default volatile