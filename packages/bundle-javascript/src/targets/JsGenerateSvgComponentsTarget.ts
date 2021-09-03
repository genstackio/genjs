import AbstractJsTarget from './AbstractJsTarget';

export class JsGenerateSvgComponentsTarget extends AbstractJsTarget {
    getCommandName() {
        return 'generate-svg-components';
    }
}

export default JsGenerateSvgComponentsTarget