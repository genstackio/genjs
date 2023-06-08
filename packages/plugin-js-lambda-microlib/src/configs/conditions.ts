const patterns = [
    // $status[X => Y]
    {
        pattern: /^\s*(\$)([a-z0-9_]+)\s*\[\s*([a-z0-9_]+|\*)\s*=>\s*([a-z0-9_]+|\*)\s*]\s*$/i,
        build: (matches) => ({
            type: 'transition',
            attribute: matches[2],
            from: matches[3],
            to: matches[4],
            dataKey: matches[1],
        })
    },
    // $email[changed]
    {
        pattern: /^\s*(\$)([a-z0-9_]+)\s*\[\s*(changed|cleared)\s*]\s*$/i,
        build: (matches) => ({
            type: `value-${matches[3]}`,
            attribute: matches[2],
            dataKey: matches[1],
        })
    },
    // $price>12
    {
        pattern: /^\s*([$%#])([a-z0-9_]+)\s*(=|<>|>|<|!=|%)(.*)$/i, build: (matches) => {
            const opMap = {'=': 'eq', '>': 'gt', '>=': 'gte', '<': 'lt', '<=': 'lte', '<>': 'ne', '!=': 'ne', '%': 'mod'};
            return {
                type: opMap[matches[3]] || opMap['eq'],
                attribute: matches[2],
                value: matches[4],
                dataKey: matches[1],
            };
        }
    },
    // $enabled
    {
        pattern: /^\s*([$%#])([a-z0-9_]+)$/i, build: (matches) => ({
            type: 'defined',
            attribute: matches[2],
            dataKey: matches[1],
        }),
    }
];

export default patterns;