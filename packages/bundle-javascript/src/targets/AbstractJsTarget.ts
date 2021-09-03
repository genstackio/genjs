import {GenericTarget} from '@genjs/genjs';

export abstract class AbstractJsTarget extends GenericTarget {
    abstract getCommandName(options: any): string;
    getCommandPrefix(options: any) {
        switch ((options.npm_client || options.npmClient || 'npm').toLowerCase()) {
            case 'npm':
                if (this.isScriptCommand()) {
                    return 'npm run';
                }
                return 'npm';
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
        return {};
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