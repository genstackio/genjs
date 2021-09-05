import AbstractJsTarget from './AbstractJsTarget';

export class JsGenerateSvgComponentsTarget extends AbstractJsTarget {
    getCommandName() {
        return 'generate-svg-components';
    }
    buildDescription() {
        return 'Generate React components from SVG files';
    }
}

export default JsGenerateSvgComponentsTarget