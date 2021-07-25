import {GitIgnoreTemplate, MakefileTemplate, ReadmeTemplate} from "./templates";

export interface IWorkflow {
    mount(step: string, definition: any): void;
    populateMakefile(makefile: MakefileTemplate): void;
    populateGitIgnore(gitignore: GitIgnoreTemplate): void;
    populateReadme(readme: ReadmeTemplate): void;
}

export default IWorkflow;
