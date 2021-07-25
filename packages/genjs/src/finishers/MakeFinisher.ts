import CommandFinisher from "./CommandFinisher";

export class MakeFinisher extends CommandFinisher {
    constructor(target: string, envs: any = {}, options: any = {}) {
        super(['make', target, ...(Object.entries(envs).map(([k, v]) => `${k}=${v}`) as string[])] as string[], options);
    }
}

export default MakeFinisher