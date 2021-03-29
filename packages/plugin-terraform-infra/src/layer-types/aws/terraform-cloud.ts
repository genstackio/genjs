function terraformCloud() {
    return {
        providers: [
            {type: 'aws', region: '{{region}}'},
        ],
    }
}

export default terraformCloud