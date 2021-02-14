// noinspection JSUnusedLocalSymbols
export function userReference(d: any, name: string, schema: any, ctx: any) {
    if (!/^user_ref:/.test(d.type)) return;

    d.type = d.type.substr(5);
    d['value'] = {type: '@user_id'};
}

export default userReference