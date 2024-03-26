import {GenericTarget} from '@genjs/genjs';

export abstract class AbstractJsTarget extends GenericTarget {
    abstract getCommandName(options: any): string;
    getCommandPrefix(options: any) {
        switch ((options.npm_client || options.npmClient || 'npm').toLowerCase()) {
            case 'npm':
                if (options.force_npm_run || this.isScriptCommand()) {
                    return 'npm --silent run';
                }
                return 'npm --silent';
            default:
            case 'yarn':
                return 'yarn --silent';
        }
    }
    isScriptCommand(): boolean {
        return true;
    }
    getCommandOptions(options: any): any {
        return {
            ...(options.options || {}),
        }
    }
    getCommandEnvs(options: any): any {
        return options?.envs || {};
    }
    buildSteps(options: any) {
        return [
            this.buildCli(
                `${this.getCommandPrefix(options)} ${this.getCommandName(options)}`,
                [],
                this.getCommandOptions(options),
                options,
                {},
                [],
                [],
                this.getCommandEnvs(options),
            )
        ];
    }
}

export default AbstractJsTarget