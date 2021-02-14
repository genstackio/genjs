// noinspection JSUnusedLocalSymbols
function parse(type, tokens, d: any, name: string, schema: any, ctx: any) {
    const [parentField, mode, ...extraTokens] = tokens;
    d.from = parentField;
    d.type = 'string';
    // output will be reverse-transformed depending on type
    d.convert = d.convert ? (Array.isArray(d.convert) ? d.convert : [d.convert]) : [];

    let algorithm;

    switch (mode) {
        case 'content':
            // output is reverse-transformed from object containing bucket/key/name/contentType to raw (content)
            d.convert.push({type: '@s3file_content'});
            break;
        case 'fingerprint':
            [algorithm = undefined] = extraTokens;
            // output is reverse-transformed from object containing bucket/key/name/contentType to raw (content)
            d.convert.push({type: '@s3file_fingerprint', config: {algorithm}});
            break;
        case 'hash':
            [algorithm = undefined] = extraTokens;
            // output is reverse-transformed from object containing bucket/key/name/contentType to raw (content)
            d.convert.push({type: '@s3file_hash', config: {algorithm}});
            break;
        case 'infos':
            // output is not reverse-transformed
            break;
        case 'url':
            // output is reverse-transformed from object containing bucket/key/name/contentType to s3 view url
            d.convert.push({type: '@s3file_url'});
            break;
        case 'url_infos':
            // output is reverse-transformed from object containing bucket/key/name/contentType to s3 view url object
            d.convert.push({type: '@s3file_url_infos'});
            break;
        case 'view_url':
            // output is reverse-transformed from object containing bucket/key/name/contentType to s3 view url
            d.convert.push({type: '@s3file_url_view'});
            break;
        case 'view_url_infos':
            // output is reverse-transformed from object containing bucket/key/name/contentType to s3 view url object
            d.convert.push({type: '@s3file_url_view_infos'});
            break;
        case 'dl_url':
            // output is reverse-transformed from object containing bucket/key/name/contentType to s3 download url
            d.convert.push({type: '@s3file_url_dl'});
            break;
        case 'dl_url_infos':
            // output is reverse-transformed from object containing bucket/key/name/contentType to s3 download url object
            d.convert.push({type: '@s3file_url_dl_infos'});
            break;
        case 'ul_url':
            // output is reverse-transformed from object containing bucket/key/name/contentType to s3 upload url
            d.convert.push({type: '@s3file_url_ul'});
            break;
        case 'ul_url_infos':
            // output is reverse-transformed from object containing bucket/key/name/contentType to s3 upload url object
            d.convert.push({type: '@s3file_url_ul_infos'});
            break;

    }
}

export default {
    prefixes: ['storageattr'],
    parse,
}