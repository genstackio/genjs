export default ({name, contentType, code: rawCode, imageCode, prefix, idField, tokenField}, def) => {
    const [code = undefined, keyField = undefined] = (rawCode || imageCode || '').split(/\s*,\s*/)
    let urlPattern: string|undefined = undefined;
    if (code) {
        urlPattern = `[[process.env.IMAGE_URL_PATTERN_PREFIX]]${code}/${keyField}/<<fingerprint>>/${name || `${(def?.name || '').replace(/Chart$/, '').toLowerCase() || 'chart'}<<extension>>`}`;
    }
    return {
        type: 'object',
        internal: true,
        convert: {
            type: '@chart',
            always: true,
            config: {name, contentType, prefix, idField, tokenField, ...(code ? {code} : {}), ...(urlPattern ? {urlPattern} : {})},
        },
    };
}