import {GenericTarget} from '@genjs/genjs';

export class HelpTarget extends GenericTarget {
    buildSteps() {
        return [
            `grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\\033[36m%-30s\\033[0m %s\\n", $$1, $$2}'`,
        ];
    }
    buildDescription() {
        return 'Display this help';
    }
}

export default HelpTarget