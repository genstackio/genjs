import AbstractWorkflow, {workflow_config} from "../AbstractWorkflow";
import YAML from 'yaml';
import {readFileSync} from "fs";

export class YamlWorkflow extends AbstractWorkflow {
    protected constructor(file: string) {
        super(YamlWorkflow.loadConfigFile(file));
    }
    // noinspection JSMethodCanBeStatic
    private static loadConfigFile(path: string): workflow_config {
        return YAML.parse(readFileSync(path, 'utf8'), {prettyErrors: true});
    }
}

// noinspection JSUnusedGlobalSymbols
export default YamlWorkflow;
