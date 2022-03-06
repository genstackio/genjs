export default ({bucket, key, name, contentType = 'text/css', code: rawCode}, def) => {
    const [code = undefined, keyField = undefined] = (rawCode || '').split(/\s*,\s*/)
    let urlPattern: string|undefined = undefined;
    if (code) {
        urlPattern = `[[process.env.CSS_URL_PATTERN_PREFIX]]${code}/${keyField}/<<fingerprint>>/${name || `${(def?.name || '').replace(/Css$/, '').toLowerCase() || 'css'}<<extension>>`}`;
    }
    return {
        type: 'object',
        transform: {
            type: '@css',
            config: {bucket, key, name, contentType},
        },
        convert: {
            type: '@css',
            always: true,
            config: {bucket, key, name, contentType, ...(code ? {code} : {}), ...(urlPattern ? {urlPattern} : {})},
        },
    };
}