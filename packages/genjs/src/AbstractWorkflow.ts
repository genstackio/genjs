import IWorkflow from "./IWorkflow";
import {GitIgnoreTemplate, MakefileTemplate, ReadmeTemplate} from "./templates";

export type workflow_config_step = null | string | string[];
export type workflow_config_var = string;
export type workflow_config_steps = {
    default: string;
    [key:string]: workflow_config_step;
};
export type workflow_config_vars = {
    [key:string]: workflow_config_var;
};
export type workflow_config = {
    steps: workflow_config_steps;
    vars: workflow_config_vars;
}

export abstract class AbstractWorkflow implements IWorkflow {
    protected config: workflow_config;
    protected steps: {[key: string]: any};
    protected constructor(config: workflow_config) {
        this.config = config;
        this.steps = {};
    }
    mount(step: string, definition: any) {
        this.steps[step] = definition;
    }
    protected populateMakefileStepFromTemplate(makefile: MakefileTemplate, k: string, def: string) {
        switch (def) {
            default:
                makefile.addTarget(k);
                break;
        }
    }
    private populateMakefileStep(makefile: MakefileTemplate, k: string, def: any) {
        if ('default' === k) {
            makefile.setDefaultTarget(k);
        } else if (Array.isArray(def)) {
            makefile.addMetaTarget(k, def);
        } else if (null === def) {
            makefile.addTarget(k);
        } else if ('string' === typeof def) {
            this.populateMakefileStepFromTemplate(makefile, k, def);
        } else if (def && def.type) {
            const {type, options, extraSteps = [], extraDependencies = []} = def;
            makefile.addPredefinedTarget(k, type, options, extraSteps, extraDependencies);
        }
    }
    populateMakefile(makefile: MakefileTemplate) {
        Object.entries(this.config.vars).forEach(([k, v]) => {
            if (v && (v['default'] || v['exported'])) {
                makefile.addGlobalVar(k, v['default']);
                v['exported'] && makefile.addExportedVar(k);
            } else {
                makefile.addGlobalVar(k, v);
            }
        });
        const processedSteps = {};
        Object.entries(this.config.steps).forEach(([k, v]) => {
            this.populateMakefileStep(makefile, k, this.steps[k] || v || null);
            processedSteps[k] = true;
        });
        Object.entries(this.steps).forEach(([k, v]) => {
            if (!processedSteps[k]) {
                this.populateMakefileStep(makefile, k, v);
                processedSteps[k] = true;
            }
        })
    }
    populateGitIgnore(gitignore: GitIgnoreTemplate) {
    }
    populateReadme(readme: ReadmeTemplate) {
    }
}

// noinspection JSUnusedGlobalSymbols
export default AbstractWorkflow;
