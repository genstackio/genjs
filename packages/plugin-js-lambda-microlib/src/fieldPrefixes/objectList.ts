// noinspection JSUnusedLocalSymbols
import {convertSimplifiedFormatToObject} from "../utils";

function parse(type, tokens, d: any) {
    const [propString] = tokens;
    d.type = 'object';
    d.list = true;
    d.props = convertSimplifiedFormatToObject(propString);
}

export default {
    prefixes: ['object_list'],
    parse,
}