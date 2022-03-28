import {CicdPackage} from '@genjs/genjs-bundle-cicd';

export default class Package extends CicdPackage {
    constructor(config: any) {
        super(config, __dirname);
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildFilesFromTemplates(vars: any, cfg: any) {
        return {
            ...super.buildFilesFromTemplates(vars, cfg),
            ...this.buildWorkflowsFilesFromTemplates(vars, cfg),
            ...this.buildProjectsWorkflowsFilesFromTemplates(vars, cfg),
            ...this.buildParallelWorkflowsFilesFromTemplates(vars, cfg),
        }
    }
    protected buildWorkflowsFilesFromTemplates(vars: any, cfg: any) {
        const c = {workflows: {}, ...(vars.github || {})};
        return Object.entries(c.workflows).reduce((acc, [k, v]) => {
            const fileName = `workflows/${k}.yml`;
            this.hasTemplate(fileName) && (acc[fileName] = true);
            return acc;
        }, {} as any);
    }
    protected buildParallelWorkflowsFilesFromTemplates(vars: any, cfg: any) {
        const c = {parallel_workflows: {}, ...(vars.github || {})};
        return Object.entries(c.parallel_workflows).reduce((acc, [k, v]) => {
            const fileName = `workflows/parallel-${k}.yml`;
            this.hasTemplate(fileName) && (acc[fileName] = [`${fileName}.ejs`, {projects: vars.projectsWorkflows}]);
            return acc;
        }, {} as any);
    }
    protected buildProjectsWorkflowsFilesFromTemplates(vars: any, cfg: any) {
        const projectsForProjectsWorkflows = vars.projectsWorkflows || {};
        const {projects_workflows: projectsWorkflows = {}} = {projects_workflows: undefined, ...(vars.github || {})};
        if (!projectsWorkflows || !Object.keys(projectsWorkflows).length) return {};

        return Object.entries(projectsWorkflows).reduce((acc, [k, v]) => {
            const fileName = `workflows/project-${k}.yml`;
            if (!this.hasTemplate(fileName)) return acc;
            acc = Object.entries(projectsForProjectsWorkflows).reduce((acc2, [kk, vv]) => {
                acc2[`workflows/${kk}--${k}.yml`] = [`${fileName}.ejs`, vv];
                return acc2;
            }, acc);
            return acc;
        }, {} as any);
    }
    protected getTechnologies() {
        return [
            ...super.getTechnologies(),
            'github',
        ];
    }
}