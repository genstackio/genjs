import {
    applyDeployMakefileHelper,
    applyStarterMakefileHelper,
    AwsLambdaPackage
} from '@genjs/genjs-bundle-aws-lambda';
import {applyRefreshMakefileHelper} from "@genjs/genjs-bundle-package/lib/helpers/applyRefreshMakefileHelper";
import {
    BuildableBehaviour,
    CleanableBehaviour,
    InstallableBehaviour,
    LoggableBehaviour,
    TestableBehaviour
} from "@genjs/genjs";

export default class Package extends AwsLambdaPackage {
    constructor(config: any) {
        super(config, __dirname);
    }
    protected getBehaviours() {
        return [
            ...super.getBehaviours(),
            new BuildableBehaviour(),
            new CleanableBehaviour(),
            new InstallableBehaviour(),
            new TestableBehaviour(),
            new LoggableBehaviour(),
        ];
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildDefaultVars(vars: any) {
        return {
            ...super.buildDefaultVars(vars),
            description: 'Go AWS Lambda',
        };
    }
    protected buildGitIgnore(vars: any) {
        return super.buildGitIgnore(vars)
            .addIgnore('/vendor/')
            .addIgnore('/build/')
            .addIgnore('/.idea/')
            ;
    }
    protected buildMakefile(vars: any) {
        const assets: string = vars.go_assets_dir || '';
        const t = super.buildMakefile(vars)
            .addGlobalVar('env', 'dev')
            .addGlobalVar('BIN', 'main')
            .addGlobalVar('ARCH', 'linux-amd64')
            .addGlobalVar('platform_temp', undefined, '$(subst -, ,$(ARCH))')
            .addGlobalVar('GOOS', undefined, '$(word 1, $(platform_temp))')
            .addGlobalVar('GOARCH', undefined, '$(word 2, $(platform_temp))')
            .addGlobalVar('GOPROXY', undefined, 'https://proxy.golang.org')
            .addTarget('arch', ['echo $(shell go env GOOS)-$(shell go env GOARCH)'], [], {}, 'Display current arch (os + arch)')
            .addMetaTarget('build', ['build-binary', 'build-package'], {}, 'Build Go binary and Lambda ZIP package')
            .addTarget('build-binary', ['GOOS=$(GOOS) GOARCH=$(GOARCH) CGO_ENABLED=0 go build -o build/bin/$(GOOS)/$(GOARCH)/$(BIN) cmd/main/*.go'], ['prepare-build-dir'], {}, 'Build Go binary')
            .addTarget('test', ['go test cmd/main/*.go'], [], {}, 'Execute the tests')
            .addTarget('format', ['gofmt -w cmd/main/*.go'], [], {}, 'Format the Go source code')
            .addTarget('build-package', [assets ? `cp -R ${assets} build/bin/$(GOOS)/$(GOARCH)/` : undefined, `cd build/bin/$(GOOS)/$(GOARCH) && zip -r ../../../../build/package.zip $(BIN) ${assets ? `${assets} ` : ''}>/dev/null`].filter(x => !!x) as string[], ['prepare-build-dir'], {}, 'Build the Lambda ZIP package')
            .addMetaTarget('clean', ['clean-package', 'clean-binary', 'clean-build-dir'], {}, 'Remove the generated directories and files')
            .addTarget('clean-binary', ['rm -rf build/bin'], [], {}, 'Remove the built Go Binary')
            .addTarget('clean-build-dir', ['rm -rf build'], [], {}, 'Remove the build directory')
            .addTarget('clean-package', ['rm -rf build/package.zip'], [], {}, 'Remove the Lambda ZIP package')
            .addTarget('install', ['go mod vendor'], [], {}, 'Install the Go dependencies')
            .addTarget('prepare-build-dir', ['mkdir -p build'], [], {}, 'Create the build directory')
            .addMetaTarget('re', ['clean', 'build'], {}, 'Re-build the binary')
            .addTarget('run', ['./build/bin/$(GOOS)/$(GOARCH)/$(BIN)'], [], {}, 'Execute the specified binary')
        ;

        if (this.hasFeature('loggable')) {
            t.addPredefinedTarget('log', 'aws-logs-tail', {group: vars.log_group || `/aws/lambda/$(env)-${vars.name}`, follow: true});
        }
        applyStarterMakefileHelper(t, vars, this);
        applyDeployMakefileHelper(t, vars, this, {predefinedTarget: 'js-deploy'});
        applyRefreshMakefileHelper(t, vars, this);

        return t;
    }
}