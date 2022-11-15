export default ({steps, autoTransitionTo, transitions = undefined, processor = undefined}: {steps?: any, autoTransitionTo?: string, transitions?: any, processor?: any}) => ({
    type: 'string',
    searchType: 'keyword',
    validators: [
        {type: '@values', config: {values: steps}},
        ...(transitions ? [{type: '@transition', config: {transitions}}] : []),
    ],
    ...(processor ? {trigger: {type: '@processor', config: processor}} : {}),
    prefetch: true,
    autoTransitionTo,
})