import AbstractJsTarget from './AbstractJsTarget';

export class JsLintTarget extends AbstractJsTarget {
    getCommandName() {
        return 'lint';
    }
    buildDescription() {
        return 'Lint the Javascript source code';
    }
}

export default JsLintTarget