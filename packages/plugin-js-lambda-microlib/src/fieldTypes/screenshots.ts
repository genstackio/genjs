export default ({kind, key}, def) => {
    return {
        type: 'object',
        internal: true,
        convert: {
            type: '@screenshots',
            always: true,
            config: {kind, key},
        },
    };
}