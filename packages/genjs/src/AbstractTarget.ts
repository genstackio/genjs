import ITarget from "./ITarget";

export abstract class AbstractTarget implements ITarget {
    public name: string;
    public steps: string[];
    public dependencies: string[];
    public relativeToRoot: string;
    public description: string;
    constructor({name, steps = [], dependencies = [], description = undefined, options = {}}: {name: string, steps?: string[], dependencies?: string[], description?: string, options?: any}) {
        this.name = name;
        options = this.buildOptions(options);
        this.relativeToRoot = options.relativeToRoot || '..';
        const localSteps = [...this.buildSteps(options), ...steps].filter(x => !!x) as string[];
        this.dependencies = [...this.buildDependencies(options), ...dependencies].filter(x => !!x) as string[];
        this.steps = this.convertSteps(this.dependencies.length ? localSteps : (localSteps.length ? localSteps : ['true']), options);
        this.description = this.buildDescription(options, description);
    }
    buildDescription(options: any, originalDescription: string|undefined): string {
        return originalDescription || '';
    }
    buildRelativeToRootPath(path: string): string {
        return `${this.relativeToRoot}/${path}`;
    }
    buildOptions(options: any): any {
        return options;
    }
    buildSteps(options: any): (string|false)[] {
        return [];
    }
    buildDependencies(options: any): (string|false)[] {
        return [];
    }
    buildCliOptions(opts: any, options: any): string {
        return Object.entries(opts).reduce((acc, [k, v]) => {
            if (undefined === v) return acc;
            const x = (k.length > 1) ? '--' : '-';
            const vv = Array.isArray(v) ? v : [v];
            if (0 === vv.length) return acc;
            return vv.reduce((acc2, vvv) => {
                const value = true === vvv ? '' : String(vvv);
                return `${acc2 || ''}${acc2 ? ' ' : ''}${x}${k}${value ? ' ' : ''}${value || ''}`;
            }, acc);
        }, '');
    }
    buildCliEnvs(envs: any, options: any): string {
        return Object.entries(envs).reduce((acc, [k, v]) => {
            if (undefined === v) return acc;
            const value = true === v ? '1' : String(v);
            return `${acc || ''}${acc ? ' ' : ''}${k}=${value || ''}`;
        }, '');
    }
    buildCliArgs(args: any, options: any): string {
        return args.reduce((acc, v) => {
            if (undefined === v) return acc;
            return `${acc || ''}${acc ? ' ' : ''}${v}`;
        }, '');
    }
    buildCli(command: string, args: (string|undefined)[], opts: any, options: any, preOpts: any = {}, preCmds: string[] = [], postCmds: string[] = [], envs: any = {}): string {
        const a = this.buildCliArgs(args, options)
        const o = this.buildCliOptions(opts, options)
        const po = this.buildCliOptions(preOpts, options)
        const ev = this.buildCliEnvs(envs, options)
        const x = `${ev || ''}${ev ? ' ' : ''}${command}${po ? ' ' : ''}${po || ''}${a ? ' ' : ''}${a || ''}${o ? ' ' : ''}${o || ''}`;
        const pre = `${preCmds.join(' && ')}${preCmds.length ? ' && ' : ''}`;
        const post = `${postCmds.length ? ' && ' : ''}${postCmds.join(' && ')}`;
        return `${pre || ''}${(pre || post) ? '(' : ''}${x}${(pre || post) ? ')' : ''}${post || ''}`;
    }
    convertSteps(steps: string[], options: any): string[] {
        options.dir && (steps = steps.map(s => `cd ${options.dir} && ${s}`));
        options.awsProfile && (steps = steps.map(s => /(aws |make )/.test(s) ? `AWS_PROFILE=${('string' === typeof options.awsProfile) ? options.awsProfile : '$(AWS_PROFILE)'} ${s}` : s));
        options.awsRegion && (steps = steps.map(s => /(aws |make )/.test(s) ? `AWS_REGION=${('string' === typeof options.awsRegion) ? options.awsRegion : '$(AWS_REGION)'} ${s}` : s));
        options.awsEc2MetadataDisabled && (steps = steps.map(s => /(aws |make )/.test(s) ? `AWS_EC2_METADATA_DISABLED=${('string' === typeof options.awsEc2MetadataDisabled) ? options.awsEc2MetadataDisabled : '$(AWS_EC2_METADATA_DISABLED)'} ${s}` : s));
        options.awsDefaultRegion && (steps = steps.map(s => /(aws |make )/.test(s) ? `AWS_DEFAULT_REGION=${('string' === typeof options.awsDefaultRegion) ? options.awsDefaultRegion : '$(AWS_DEFAULT_REGION)'} ${s}` : s));
        options.ci && (steps = steps.map(s => `CI=${(options.ci === 'hidden') ? '' : 'true'} ${s}`));
        options.sourceLocalEnvLocal && (steps = steps.map(s => `set -a && . ./.env.local && set +a && ${s}`));
        steps = steps.map(s => (s.slice(0, 1) === '@') ? s : `@${s}`);
        return steps;
    }
}

export default AbstractTarget