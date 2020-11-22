import Genjs from "./Genjs";

export type PackageGroupConfig = {
    name: string,
    packages?: {[key: string]: any},
    dir: string,
}

export class PackageGroup {
    public readonly packages: any[] = [];
    public readonly name: string;
    public readonly dir: string;
    constructor(genjs: Genjs, {name, packages = {}, dir}: PackageGroupConfig) {
        this.name = name;
        this.dir = dir;
        this.packages = Object.entries(packages).map(([name, p]) => ({name, dir, ...p}));
    }
    getName(): string {
        return this.name;
    }
    getPackages(): any[] {
        return this.packages;
    }
    getDir(): string {
        return this.dir;
    }
}

export default PackageGroup
