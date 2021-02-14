// noinspection JSUnusedLocalSymbols
function parse(type, tokens, d: any, name: string, schema: any, ctx: any) {
    const [bucket, key, uploadName = undefined, contentType = undefined] = tokens;
    d.type = 'object'; // {bucket: string, key: string, name?: string, contentType?: string}
    // input is transformed from raw to object containing bucket/key/name/contentType
    d.transform = d.transform ? (Array.isArray(d.transform) ? d.transform : [d.transform]) : [];
    d.transform.push({type: '@s3file', config: {bucket, key, name: uploadName, contentType}});
    // output will be reverse-transformed depending on type
    d.convert = d.convert ? (Array.isArray(d.convert) ? d.convert : [d.convert]) : [];

    switch (type) {
        case 'storage':
            // output is reverse-transformed from object containing bucket/key/name/contentType to raw (content)
            d.convert.push({type: '@s3file_content'});
            break;
        case 'storage_infos':
            // output is not reverse-transformed
            break;
        case 'storage_url':
            // output is reverse-transformed from object containing bucket/key/name/contentType to s3 view url
            d.convert.push({type: '@s3file_url'});
            break;
        case 'storage_url_infos':
            // output is reverse-transformed from object containing bucket/key/name/contentType to s3 view url object
            d.convert.push({type: '@s3file_url_infos'});
            break;
        case 'storage_url_view':
            // output is reverse-transformed from object containing bucket/key/name/contentType to s3 view url
            d.convert.push({type: '@s3file_url_view'});
            break;
        case 'storage_url_view_infos':
            // output is reverse-transformed from object containing bucket/key/name/contentType to s3 view url object
            d.convert.push({type: '@s3file_url_view_infos'});
            break;
        case 'storage_url_dl':
            // output is reverse-transformed from object containing bucket/key/name/contentType to s3 download url
            d.convert.push({type: '@s3file_url_dl'});
            break;
        case 'storage_url_dl_infos':
            // output is reverse-transformed from object containing bucket/key/name/contentType to s3 download url object
            d.convert.push({type: '@s3file_url_dl_infos'});
            break;
        case 'storage_url_ul':
            // output is reverse-transformed from object containing bucket/key/name/contentType to s3 upload url
            d.convert.push({type: '@s3file_url_ul'});
            break;
        case 'storage_url_ul_infos':
            // output is reverse-transformed from object containing bucket/key/name/contentType to s3 upload url object
            d.convert.push({type: '@s3file_url_ul_infos'});
            break;
    }
}

export default {
    prefixes: [
        'storage', 'storage_content',
        'storage_url', 'storage_url_infos',
        'storage_url_view', 'storage_url_view_infos',
        'storage_url_dl', 'storage_url_dl_infos',
        'storage_url_ul', 'storage_url_ul_infos',
    ],
    parse,
}