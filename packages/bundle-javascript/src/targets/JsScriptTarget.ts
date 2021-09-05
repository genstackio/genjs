import AbstractJsTarget from './AbstractJsTarget';

export class JsScriptTarget extends AbstractJsTarget {
    getCommandName(options: any) {
        return options.script || 'unknown';
    }
    buildDescription(options: any) {
        return `Execute the ${options.script || 'unknown'} script (from package.json)`;
    }
}

export default JsScriptTarget