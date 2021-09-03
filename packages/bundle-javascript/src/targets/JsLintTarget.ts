import AbstractJsTarget from './AbstractJsTarget';

export class JsLintTarget extends AbstractJsTarget {
    getCommandName() {
        return 'lint';
    }
}

export default JsLintTarget