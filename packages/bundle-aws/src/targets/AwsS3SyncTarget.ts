import AbstractAwsCliTarget from './AbstractAwsCliTarget';

export class AwsS3SyncTarget extends AbstractAwsCliTarget {
    getServiceName() {
        return 's3';
    }
    getOperationName() {
        return 'sync';
    }
    getOperationArgs({source = 'build/', target = 's3://$(bucket)', targetDir = undefined}) {
        return [source, targetDir ? `${target}/${targetDir}` : target];
    }
    getOperationOptions({cacheControl, storageClass}) {
        return {
            delete: true,
            ...(cacheControl ? {['cache-control']: cacheControl} : {}),
            ...(storageClass ? {['storage-class']: storageClass} : {}),
        };
    }
    buildDescription() {
        return 'Synchronize remote S3 bucket with local directory';
    }
}

export default AwsS3SyncTarget