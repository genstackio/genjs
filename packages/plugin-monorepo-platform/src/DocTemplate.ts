import {
    AbstractFileTemplate
} from "@genjs/genjs";

export type DocTemplateConfig = {
};

export class DocTemplate extends AbstractFileTemplate {
    private readonly type: string;
    private readonly vars: any;
    constructor(type: string, config: DocTemplateConfig = {}) {
        super();
        this.vars = config;
        this.type = type;
    }
    getName(): string {
        return this.type;
    }
    getVars(): any {
        return this.vars;
    }
    getTemplatePath(): string {
        return `${__dirname}/../templates/docs/${this.type}.md`;
    }
}

export default DocTemplate