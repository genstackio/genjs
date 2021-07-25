import AbstractInitializer from "../AbstractInitializer";
import {spawn} from 'child_process';
import path from 'path';

export class CommandInitializer extends AbstractInitializer {
    private readonly command: string[];
    private readonly options: any;
    constructor(command: string[], options: any = {}) {
        super();
        this.command = command;
        this.options = {parentDir: false, ...options};
    }
    isParentDirCommand() {
        return !!this.options['parentDir'];
    }
    async execute(dir: string, vars: any): Promise<void> {
        const [a, ...args] = this.command.map(c => c.replace(/\{\{dir\}\}/g, dir));
        const n = path.basename(dir);
        return new Promise((resolve, reject) => {
            let e: any = undefined;
            const cmd = spawn(a, args, {cwd: this.isParentDirCommand() ? path.dirname(dir) : dir, env: process.env});
            cmd.stdout.on("data", data => {
                data.toString().trim().split(/\r\n/g).forEach(x => console.log(`[${n}] (initialize) ${x}`));
            });

            cmd.stderr.on("data", data => {
                data.toString().trim().split(/\r\n/g).forEach(x => console.error(`[${n}] (initialize) ERROR ${x}`));
            });

            cmd.on('error', (error) => {
                e = error;
                console.error(`[${n}] (initialize) FATAL ERROR ${error.message}`);
            });

            cmd.on("close", code => {
                if (0 !== code) {
                    console.error(`[${n}] (initialize) ERROR EXIT ${String(code)}`);
                    return reject(e);
                }
                resolve();
            });
        })
    }
}

export default CommandInitializer