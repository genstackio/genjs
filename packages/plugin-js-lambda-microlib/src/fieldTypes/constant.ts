export default ({values: allowedValues = []}) => ({type: 'string', searchType: 'keyword', validators: [{type: '@values', config: {values: allowedValues}}]})