prefix ?= myprefix
bucket_prefix ?= $(prefix)-myproject
env ?= dev
AWS_PROFILE ?= $(prefix)-$(env)
bucket ?= $(env)-$(bucket_prefix)-storybook
cloudfront ?= $(AWS_CLOUDFRONT_DISTRIBUTION_ID_STORYBOOK)

build: ## Execute the build on all the packages
	@yarn --silent lerna run build --stream

changed: ## Display all changed packages since last publish
	@yarn --silent lerna changed

clean: clean-lib clean-modules clean-coverage clean-buildinfo
clean-buildinfo: ## Remove the Typescript cache file for compilation
	@find packages/ -name tsconfig.tsbuildinfo -exec rm -rf {} +
clean-coverage: ## Remove test coverage directory
	@rm -rf coverage/
	@find packages/ -name coverage -type d -exec rm -rf {} +
clean-lib: ## Remove the Typescript generated directory containing transpiled files
	@find packages/ -name lib -type d -exec rm -rf {} +
clean-modules: ## Remove Javascript dependencies directory
	@rm -rf node_modules/
	@find packages/ -name node_modules -type d -exec rm -rf {} +

deploy: deploy-storybooks invalidate-cache
deploy-storybooks: ## Deploy the already built storybook export directory
	@yarn --silent deploy-storybooks

generate: ## Generate and synchronize the source code using GenJS
	@yarn --silent genjs

install: install-root install-packages build
install-packages: ## Install the dependencies of all packages using Lerna
	@yarn --silent lerna bootstrap
install-root: ## Install the Javascript dependencies
	@yarn --silent install

invalidate-cache: ## Invalidate the CloudFront CDN cache
	@AWS_EC2_METADATA_DISABLED=true AWS_PROFILE=$(AWS_PROFILE) aws cloudfront create-invalidation --distribution-id $(cloudfront) --paths '/*' --no-paginate --color off --no-cli-pager --output text

new:
	@yarn --silent yo ./packages/generator-package 2>/dev/null

package-build: ## Build
	@cd packages/$(p) && yarn --silent build
package-build-storybook: ## Build the Storybook to a deployable local directory
	@cd packages/$(p) && yarn --silent build-storybook
package-clear-test: ## Clear test cache
	@cd packages/$(p) && yarn --silent jest --clearCache
package-generate-svg-components: ## Generate React components from SVG files
	@cd packages/$(p) && yarn --silent generate-svg-components
package-install: ## Install the dependencies of all packages using Lerna
	@yarn --silent lerna bootstrap --scope @ohoareau/$(p)
package-storybook: ## Execute the Storybook
	@cd packages/$(p) && yarn --silent story
package-test: package-build ## Execute the tests
	@cd packages/$(p) && yarn --silent test --coverage --detectOpenHandles

publish: ## Publish all changed packages
	@yarn --silent lerna publish

test: build test-only
test-local: ## Execute the tests
	@yarn --silent test --coverage --detectOpenHandles
test-only: ## Execute the tests
	@yarn --silent test --runInBand --coverage --detectOpenHandles

.DEFAULT_GOAL := install
.PHONY: build \
		changed \
		clean clean-buildinfo clean-coverage clean-lib clean-modules \
		deploy deploy-storybooks \
		generate \
		install install-packages install-root \
		invalidate-cache \
		new \
		package-build package-build-storybook package-clear-test package-generate-svg-components package-install package-storybook package-test \
		publish \
		test test-local test-only
