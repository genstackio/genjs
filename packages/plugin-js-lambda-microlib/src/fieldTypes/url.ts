export default () => ({type: 'string', searchType: 'keyword', validators: [{type: '@url'}, {type: '@maxLength', config: {max: 1024}}]})