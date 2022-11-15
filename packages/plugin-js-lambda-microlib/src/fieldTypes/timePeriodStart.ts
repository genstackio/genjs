export default () => ({
    internal: true,
    type: 'number',
    searchType: 'timestampms',
    value: {
        type: '@period_date',
        config: {
            mode: 'start',
        }
    },
})