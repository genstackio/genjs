import AbstractFileTemplate from '../AbstractFileTemplate';

export type PackageExcludesTemplateConfig = {
    package_exclude_type?: string,
    package_excludes?: string[],
};

export class PackageExcludesTemplate extends AbstractFileTemplate {
    private customConfig: PackageExcludesTemplateConfig ;
    private customConsumed: boolean;
    static create(vars: any): PackageExcludesTemplate {
        return new PackageExcludesTemplate(vars);
    }
    constructor(config: PackageExcludesTemplateConfig = {package_exclude_type: 'default', package_excludes: []}) {
        super();
        this.customConsumed = false;
        this.customConfig = config;
    }
    getTemplatePath() {
        return `${__dirname}/../../templates`;
    }
    getName() {
        return `package-excludes/${this.customConfig.package_exclude_type}.lst.ejs`;
    }
    getVars() {
        if (!this.customConsumed) {
            this.customConsumed = true;
        }
        return {
            excludes: this.customConfig.package_excludes || [],
            config: this.customConfig,
        }
    }
}

export default PackageExcludesTemplate