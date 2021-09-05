import AbstractJsTarget from './AbstractJsTarget';

export class JsTestTarget extends AbstractJsTarget {
    isScriptCommand(): boolean {
        return false;
    }
    getCommandName(options: any): string {
        return 'test';
    }
    getCommandOptions({all, ci, color, coverage, local, parallel = true, testClient = undefined}): any {
        switch (((testClient || 'jest') as string).toLowerCase()) {
            case 'mocha':
                return {};
            default:
            case 'jest':
                return {
                    all: (!local || (all === true)) || undefined,
                    color: (!local || (color === true)) || undefined,
                    runInBand: !parallel || undefined,
                    coverage: ((ci || coverage || local) && (false !== coverage)) || undefined,
                    detectOpenHandles: true,
                }
        }
    }
    buildDescription() {
        return 'Execute the tests';
    }
}

export default JsTestTarget