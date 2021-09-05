import {GenericTarget} from '@genjs/genjs';

export class TfgenTarget extends GenericTarget {
    buildSteps(options: any) {
        const {configFile = './config.json', sourceDir = 'layers', targetDir = 'environments'} = options;
        return [
            this.buildCli(
                `../node_modules/.bin/tfgen`,
                [configFile, sourceDir, targetDir],
                {},
                options
            )
        ];
    }
    buildDescription() {
        return 'Generate the Terraform source code using tfgen';
    }
}

export default TfgenTarget