b ?= master
f ?= $(subst plugin-,,$(p))

all: install

build:
	@yarn --silent lerna run build --stream

changed:
	@yarn --silent lerna changed

clean: clean-lib clean-modules clean-coverage clean-buildinfo
clean-buildinfo:
	@find packages/ -name tsconfig.tsbuildinfo -exec rm -rf {} +
clean-coverage:
	@rm -rf coverage/
	@find packages/ -name coverage -type d -exec rm -rf {} +
clean-lib:
	@find packages/ -name lib -type d -exec rm -rf {} +
clean-modules:
	@rm -rf node_modules/
	@find packages/ -name node_modules -type d -exec rm -rf {} +

generate:
	@yarn --silent genjs

install: install-root install-packages build
install-packages:
	@yarn --silent lerna bootstrap
install-root:
	@yarn --silent install

package-build:
	@cd packages/$(p) && yarn --silent build
package-clear-test:
	@cd packages/$(p) && yarn --silent jest --clearCache
package-fixture:
	@cd packages/$(p) && yarn --silent gen -c __fixtures__/$(f).js -t ../../generated/$(f)
package-fixture-dir:
	@cd packages/$(p) && yarn --silent gen -c __fixtures__/$(f) -t ../../generated/$(f)
package-fixture-dir-dump:
	@cd packages/$(p) && yarn --silent dump -c __fixtures__/$(f) -t ../../generated/$(f)
package-fixture-dump:
	@cd packages/$(p) && yarn --silent dump -c __fixtures__/$(f).js -t ../../generated/$(f)
package-install:
	@yarn --silent lerna bootstrap --scope @genjs/$(p)
package-test: package-build
	@cd packages/$(p) && yarn --silent test --coverage --detectOpenHandles

pr:
	@hub pull-request -b $(b)

publish:
	@yarn --silent lerna publish

test: build test-only
test-local:
	@yarn --silent test --coverage --detectOpenHandles
test-only:
	@yarn --silent test --runInBand --coverage --detectOpenHandles

.PHONY: all \
		build \
		changed \
		clean clean-buildinfo clean-coverage clean-lib clean-modules \
		generate \
		install install-packages install-root \
		package-build package-clear-test package-fixture package-fixture-dir package-fixture-dir-dump package-fixture-dump package-install package-test \
		pr \
		publish \
		test test-local test-only