import AbstractDockerTarget from './AbstractDockerTarget';

export class DockerTagTarget extends AbstractDockerTarget {
    getCommandName() {
        return 'tag';
    }
    getCommandArgs(options: any): string[] {
        return [
            options.tag,
            options.remoteTag,
        ];
    }
    buildDescription() {
        return 'Tag the Docker image';
    }
}

export default DockerTagTarget