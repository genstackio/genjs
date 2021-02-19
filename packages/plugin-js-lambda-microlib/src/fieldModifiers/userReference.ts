// noinspection JSUnusedLocalSymbols
export function parse(d: any, name: string, schema: any, ctx: any) {
    if (!/^user_ref:/.test(d.type)) return;

    d.type = d.type.substr(5);
    d['value'] = {type: '@user_id'};
}

export default {priority: 70, parse}