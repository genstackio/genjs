import AbstractAwsCliTarget from './AbstractAwsCliTarget';

export class AwsLogsTailTarget extends AbstractAwsCliTarget {
    buildOptions(options: any) {
        return super.buildOptions({
            awsRegion: '$(AWS_REGION)',
            ...options
        })
    }
    getServiceName() {
        return 'logs';
    }
    getOperationName() {
        return 'tail';
    }
    getOperationArgs({group, follow = true}) {
        return [group, ...(follow ? ['--follow'] : [])];
    }
    getOperationOptions() {
        return {};
    }
    buildDescription() {
        return 'Tail lambda logs';
    }
}

export default AwsLogsTailTarget