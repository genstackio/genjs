import Genjs from "./Genjs";

export type PackageGroupConfig = {
    name: string,
    packages?: {[key: string]: any},
    dir: string,
}

export class PackageGroup {
    public readonly packages: any[] = [];
    public readonly requiredPackagers: string[] = [];
    public readonly name: string;
    public readonly dir: string;
    constructor(genjs: Genjs, {name, packages = {}, dir}: PackageGroupConfig) {
        this.name = name;
        this.dir = dir;
        const {packages: pkgs, requiredPackagers: plgs} = Object.entries(packages).reduce((acc, [name, p]) => {
            acc.packages.push({name, dir, ...p});
            if (p.type) {
                acc.requiredPackagers[p.type] = acc.requiredPackagers[p.type] || [];
                acc.requiredPackagers[p.type].push(name);
            }
            return acc;
        }, {packages: [] as any[], requiredPackagers: {} as any});
        this.packages = pkgs;
        this.requiredPackagers = Object.keys(plgs);
        this.requiredPackagers.sort();
    }
    getName(): string {
        return this.name;
    }
    getPackages(): any[] {
        return this.packages;
    }
    getRequiredPackagers(): string[] {
        return this.requiredPackagers;
    }
    getDir(): string {
        return this.dir;
    }
}

export default PackageGroup
