export default ({bucket, key, name, contentType}) => ({
    type: 'object',
    transform: {
        type: '@image',
        config: {bucket, key, name, contentType},
    },
    convert: {
        type: '@image',
        config: {bucket, key, name, contentType}
    },
})