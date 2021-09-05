env ?= dev

build: ## Build
	@yarn --silent build

clean: clean-modules clean-coverage
clean-coverage: ## Remove test coverage directory
	@rm -rf coverage/
clean-modules: ## Remove Javascript dependencies directory
	@rm -rf node_modules/

deploy: ## Deploy
	@yarn --silent deploy

generate-env-local: ## Generate the .env.local file based on dynamic configuration
	@../node_modules/.bin/generate-vars-from-terraform-outputs ../outputs/$(env) ./terraform-to-vars.json > ./.env.local

install: ## Install the Javascript dependencies
	@yarn --silent install

pre-install:
	@true

test: ## Execute the tests
	@yarn --silent test --detectOpenHandles
test-ci: ## Execute the tests
	@CI=true yarn --silent test --all --color --coverage --detectOpenHandles
test-cov: ## Execute the tests
	@yarn --silent test --coverage --detectOpenHandles

.DEFAULT_GOAL := install
.PHONY: build \
		clean clean-coverage clean-modules \
		deploy \
		generate-env-local \
		install \
		pre-install \
		test test-ci test-cov