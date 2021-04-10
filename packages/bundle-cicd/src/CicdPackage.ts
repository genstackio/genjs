import {AbstractPackage} from '@genjs/genjs';
import {existsSync} from "fs";

export class CicdPackage extends AbstractPackage {
    protected hasTemplate(name: string): boolean {
        return existsSync(`${this.getTemplateRoot()}/${name}.ejs`);
    }
    protected getTechnologies(): any {
        return [
            ...super.getTechnologies(),
            'git'
        ];
    }
}

export default CicdPackage