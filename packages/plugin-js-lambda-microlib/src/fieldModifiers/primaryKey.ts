// noinspection JSUnusedLocalSymbols
export function primaryKey(d: any, name: string, schema: any, ctx: any) {
    if (!/^&/.test(d.type)) return;

    d.primaryKey = true;
    d.type = d.type.substr(1);
}

export default primaryKey