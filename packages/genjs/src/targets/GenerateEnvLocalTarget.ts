import GenericTarget from './GenericTarget';

export class GenerateEnvLocalTarget extends GenericTarget {
    buildSteps({prefix, env = '$(env)'}) {
        const binDir = this.buildRelativeToRootPath('node_modules/.bin');
        if (!prefix) return [
            `${binDir}/generate-vars-from-terraform-outputs ${env} ./terraform-to-vars.json > ./.env.local`,
        ];
        return [
            `${binDir}/env ${prefix}_ > ./.env.local`,
            `${binDir}/generate-vars-from-terraform-outputs ${env} ./terraform-to-vars.json >> ./.env.local`,
        ];
    }
}

export default GenerateEnvLocalTarget