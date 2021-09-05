import {
    applyDeployMakefileHelper,
    applyStarterMakefileHelper,
    AwsLambdaPackage
} from '@genjs/genjs-bundle-aws-lambda';
import {applyRefreshMakefileHelper} from "@genjs/genjs-bundle-package/lib/helpers/applyRefreshMakefileHelper";
import {BuildableBehaviour, CleanableBehaviour, InstallableBehaviour, TestableBehaviour} from "@genjs/genjs";

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
        const t = super.buildMakefile(vars)
            .addGlobalVar('env', 'dev')
            .addGlobalVar('BIN', 'main')
            .addGlobalVar('ARCH', 'linux-amd64')
            .addGlobalVar('platform_temp', undefined, '$(subst -, ,$(ARCH))')
            .addGlobalVar('GOOS', undefined, '$(word 1, $(platform_temp))')
            .addGlobalVar('GOARCH', undefined, '$(word 2, $(platform_temp))')
            .addGlobalVar('GOPROXY', undefined, 'https://proxy.golang.org')
            .addTarget('arch', ['echo $(shell go env GOOS)-$(shell go env GOARCH)'])
            .addMetaTarget('build', ['build-binary', 'build-package'])
            .addTarget('build-binary', ['GOOS=$(GOOS) GOARCH=$(GOARCH) CGO_ENABLED=0 go build -o build/bin/$(GOOS)/$(GOARCH)/$(BIN) cmd/main/main.go'], ['prepare-build-dir'])
            .addTarget('build-package', ['cd build/bin/$(GOOS)/$(GOARCH) && zip -r ../../../../build/package.zip $(BIN) >/dev/null'], ['prepare-build-dir'])
            .addMetaTarget('clean', ['clean-package', 'clean-binary', 'clean-build-dir'])
            .addTarget('clean-binary', ['rm -rf build/bin'])
            .addTarget('clean-build-dir', ['rm -rf build'])
            .addTarget('clean-package', ['rm -rf build/package.zip'])
            .addTarget('install', ['go mod vendor'])
            .addTarget('prepare-build-dir', ['mkdir -p build'])
            .addMetaTarget('re', ['clean', 'build'])
            .addTarget('run', ['./build/bin/$(GOOS)/$(GOARCH)/$(BIN)'])
        ;

        applyStarterMakefileHelper(t, vars, this);
        applyDeployMakefileHelper(t, vars, this, {predefinedTarget: 'js-deploy'});
        applyRefreshMakefileHelper(t, vars, this);

        return t;
    }
}