import AbstractDockerTarget from './AbstractDockerTarget';

export class DockerPushTarget extends AbstractDockerTarget {
    getCommandName() {
        return 'push';
    }
    getCommandArgs(options: any): string[] {
        return [
            options.tag,
        ];
    }
    buildDescription() {
        return 'Push the Docker image';
    }
}

export default DockerPushTarget