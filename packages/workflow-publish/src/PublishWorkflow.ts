import {YamlWorkflow} from "@genjs/genjs";

export class PublishWorflow extends YamlWorkflow {
    constructor() {
        super(`${__dirname}/../workflows/publish.yml`);
    }
}

// noinspection JSUnusedGlobalSymbols
export default PublishWorflow;
