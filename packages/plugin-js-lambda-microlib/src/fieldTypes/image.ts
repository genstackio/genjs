export default ({bucket, key, name, contentType, imageCode}, def) => {
    const [code = undefined, keyField = undefined] = (imageCode || '').split(/\s*,\s*/)
    let urlPattern: string|undefined = undefined;
    if (code) {
        urlPattern = `[[process.env.IMAGE_URL_PATTERN_PREFIX]]${code}/${keyField}/<<fingerprint>>/${name || `${(def?.name || '').replace(/Image$/, '').toLowerCase() || 'image'}<<extension>>`}`;
    }
    return {
        type: 'object',
        transform: {
            type: '@image',
            config: {bucket, key, name, contentType},
        },
        convert: {
            type: '@image',
            always: true,
            config: {bucket, key, name, contentType, ...(code ? {code} : {}), ...(urlPattern ? {urlPattern} : {})},
        },
    };
}