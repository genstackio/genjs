export function convertSimplifiedFormatToObject(s) {
    return s.split(/\s*,\s*/).reduce((acc, x) => {
        const [a, b = undefined] = x.split('=');
        acc[a] = {type: b || 'string'};
        return acc;
    }, {});
}
