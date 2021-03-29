function main({name = 'main', source, version = undefined, providers = {}, vars = {}, outputs = {}}) {
    return {
        name,
        source,
        version,
        providers,
        vars,
        outputs,
    }
}

export default main