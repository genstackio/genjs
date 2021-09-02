import AbstractJsTarget from './AbstractJsTarget';

export class JsScriptTarget extends AbstractJsTarget {
    getCommandName(options: any) {
        return options.script || 'unknown';
    }
}

export default JsScriptTarget