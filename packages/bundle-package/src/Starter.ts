export type StarterConfig = {
    name: string,
    type: string,
    params?: {[key: string]: any},
    vars: {[key: string]: any},
    directory?: string,
    custom?: boolean,
    envs?: {[key: string]: any},
};

export default class Starter {
    public readonly name: string;
    public readonly type: string;
    public readonly params: {[key: string]: any};
    public readonly vars: {[key: string]: any};
    public readonly envs: {[key: string]: any};
    public readonly directory: string|undefined;
    public readonly custom: boolean;
    constructor({name, type, params = {}, directory, custom = false, vars = {}, envs = {}}: StarterConfig) {
        this.name = name;
        this.type = type;
        this.params = {o: name, ...params};
        this.vars = vars;
        this.directory = directory;
        this.custom = !!custom;
        this.envs = envs;
    }
}