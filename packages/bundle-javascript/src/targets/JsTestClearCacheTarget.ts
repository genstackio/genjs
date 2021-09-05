import AbstractJsTarget from './AbstractJsTarget';

export class JsTestClearCacheTarget extends AbstractJsTarget {
    getCommandName() {
        return 'jest';
    }
    getCommandOptions() {
        return {clearCache: true};
    }
    buildDescription() {
        return 'Clear test cache';
    }
}

export default JsTestClearCacheTarget