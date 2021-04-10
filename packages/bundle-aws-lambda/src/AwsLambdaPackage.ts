import {BasePackage} from '@genjs/genjs-bundle-package';
import {PackageExcludesTemplate} from '@genjs/genjs';

export class AwsLambdaPackage extends BasePackage {
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildDefaultVars(vars: any) {
        return {
            ...super.buildDefaultVars(vars),
            description: 'AWS Lambda',
        };
    }
    protected getDefaultExtraOptions() {
        return {
            ...super.getDefaultExtraOptions(),
            phase: 'pre',
        };
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected async buildDynamicFiles(vars: any, cfg: any) {
        return {
            ...(await super.buildDynamicFiles(vars, cfg)),
            ['package-excludes.lst']: this.buildPackageExcludes(vars),
        };
    }
    protected buildPackageExcludes(vars: any): PackageExcludesTemplate {
        return PackageExcludesTemplate.create(vars);
    }
    protected buildMakefile(vars: any) {
        return super.buildMakefile(vars);
    }
    protected getTechnologies() {
        return [
            ...super.getTechnologies(),
            'aws_cli',
            'aws_lambda',
        ];
    }
}

export default AwsLambdaPackage