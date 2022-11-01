export default ({bucket, key, name, contentType = 'application/json', code: rawCode}, def) => {
    const [code = undefined, keyField = undefined] = (rawCode || '').split(/\s*,\s*/)
    let urlPattern: string|undefined = undefined;
    if (code) {
        urlPattern = `[[process.env.JSON_URL_PATTERN_PREFIX]]${code}/${keyField}/<<fingerprint>>/${name || `${(def?.name || '').replace(/Json$/, '').toLowerCase() || 'json'}<<extension>>`}`;
    }
    return {
        type: 'object',
        transform: {
            type: '@jsonFile',
            config: {bucket, key, name, contentType},
        },
        convert: {
            type: '@jsonFile',
            always: true,
            config: {bucket, key, name, contentType, ...(code ? {code} : {}), ...(urlPattern ? {urlPattern} : {})},
        },
    };
}