// noinspection JSUnusedLocalSymbols
export function required(d: any, name: string, schema: any, ctx: any) {
    if (!/!$/.test(d.type)) return;

    d.required = true;
    d.type = d.type.substr(0, d.type.length - 1);
}

export default required