export default ({bucket, key, name, contentType = 'text/javascript', code: rawCode}, def) => {
    const [code = undefined, keyField = undefined] = (rawCode || '').split(/\s*,\s*/)
    let urlPattern: string|undefined = undefined;
    if (code) {
        urlPattern = `[[process.env.JS_URL_PATTERN_PREFIX]]${code}/${keyField}/<<fingerprint>>/${name || `${(def?.name || '').replace(/Js$/, '').toLowerCase() || 'js'}<<extension>>`}`;
    }
    return {
        type: 'object',
        transform: {
            type: '@js',
            config: {bucket, key, name, contentType},
        },
        convert: {
            type: '@js',
            always: true,
            config: {bucket, key, name, contentType, ...(code ? {code} : {}), ...(urlPattern ? {urlPattern} : {})},
        },
    };
}