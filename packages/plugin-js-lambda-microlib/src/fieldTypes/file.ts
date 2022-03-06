export default ({bucket, key, name, contentType, code: rawCode}, def) => {
    const [code = undefined, keyField = undefined] = (rawCode || '').split(/\s*,\s*/)
    let urlPattern: string|undefined = undefined;
    if (code) {
        urlPattern = `[[process.env.FILE_URL_PATTERN_PREFIX]]${code}/${keyField}/<<fingerprint>>/${name || `${(def?.name || '').replace(/File$/, '').toLowerCase() || 'file'}<<extension>>`}`;
    }
    return {
        type: 'object',
        transform: {
            type: '@file',
            config: {bucket, key, name, contentType},
        },
        convert: {
            type: '@file',
            always: true,
            config: {bucket, key, name, contentType, ...(code ? {code} : {}), ...(urlPattern ? {urlPattern} : {})},
        },
    };
}