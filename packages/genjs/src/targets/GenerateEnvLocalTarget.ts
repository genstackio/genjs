import GenericTarget from './GenericTarget';

export class GenerateEnvLocalTarget extends GenericTarget {
    buildSteps({prefix, env = '$(env)', mode}) {
        const binDir = this.buildRelativeToRootPath('node_modules/.bin');
        switch (mode) {
            case 'env-dir':
                const envDir = './env'
                if (!prefix) return [
                    `cp ${envDir}/${env}.env ./.env.local`,
                ];
                return [
                    `${binDir}/env ${prefix}_ > ./.env.local`,
                    `cat ${envDir}/${env}.env >> ./.env.local`,
                ];
            case 'none':
                return [];
            default:
            case 'terraform':
                const outputsDir = this.buildRelativeToRootPath(`outputs/${env}`);
                if (!prefix) return [
                    `${binDir}/generate-vars-from-terraform-outputs ${outputsDir} ./terraform-to-vars.json > ./.env.local`,
                ];
                return [
                    `${binDir}/env ${prefix}_ > ./.env.local`,
                    `${binDir}/generate-vars-from-terraform-outputs ${outputsDir} ./terraform-to-vars.json >> ./.env.local`,
                ];
        }
    }
    buildDescription() {
        return 'Generate the .env.local file based on dynamic configuration';
    }
}

export default GenerateEnvLocalTarget