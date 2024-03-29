import {
    ReadmeTemplate,
    ReadmeTemplateConfig,
} from "@genjs/genjs";
import {
    buildInstallProceduresVars,
    buildPreRequisitesVars,
    buildProjectEnvsVars,
    buildProjectsVars,
    buildTechnologiesVars
} from "./utils";

export type project = {
    id: string,
    name?: string,
    description: string,
    startable?: boolean,
    deployable?: boolean,
    buildable?: boolean,
    cleanable?: boolean,
    generateEnvLocalable?: boolean,
    installable?: boolean,
    preInstallable?: boolean,
    refreshable?: boolean,
    servable?: boolean,
    testable?: boolean,
    validatable?: boolean,
};

export type technology = {
    id: string,
    name?: string,
    link?: string,
};

export type RootReadmeTemplateConfig = ReadmeTemplateConfig & {
    readme?: boolean,
    projects?: {[id: string]: Omit<project, 'id'>},
    project_prefix?: string,
    project_envs?: any,
    technologies?: {[id: string]: Omit<technology, 'id'>},
    preRequisites?: {[id: string]: any},
    installProcedures?: {[id: string]: any},
};

export class RootReadmeTemplate extends ReadmeTemplate {
    constructor(config: RootReadmeTemplateConfig = {}) {
        const x = {
            project_prefix: 'xxxxxxxx',
            ...config,
        }
        super({
            ...x,
            ...buildProjectsVars(x),
            ...buildTechnologiesVars(x),
            ...buildPreRequisitesVars(x),
            ...buildInstallProceduresVars(x),
            ...buildProjectEnvsVars(x),
        });
        this
            .addNamedFragmentsFromTemplateDir(
                `${__dirname}/../templates/readme`,
                [
                    'introduction',
                    'installation',
                    'development',
                ]
            )
        ;
    }
}
export default RootReadmeTemplate