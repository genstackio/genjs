export default ({type, track = []}) => ({type: 'number', searchType: 'float', internal: true, stat: {type, track}})