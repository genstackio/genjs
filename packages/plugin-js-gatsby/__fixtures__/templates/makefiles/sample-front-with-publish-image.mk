prefix ?= myprefix
bucket_prefix ?= $(prefix)-myproject
env ?= dev
AWS_PROFILE ?= $(prefix)-$(env)
bucket ?= $(env)-$(bucket_prefix)-front
cloudfront ?= $(AWS_CLOUDFRONT_DISTRIBUTION_ID_FRONT)

build: build-code build-publish-image
build-code: ## Build
	@yarn --silent build
build-publish-image: ## Build the Docker image
	@docker build -t mytag --build-arg arg1=value1 --build-arg arg2=value2 .

deploy: deploy-publish-image
deploy-code: ## Synchronize remote S3 bucket with local directory
	@AWS_PROFILE=$(AWS_PROFILE) aws s3 sync public/ s3://$(bucket) --delete
deploy-publish-image: ## Push the Docker image
	@AWS_PROFILE=$(AWS_PROFILE) aws ecr get-login-password --region eu-west-3 | docker login --username AWS --password-stdin 012345678912.dkr.ecr.eu-west-3.amazonaws.com
	@docker push 012345678912.dkr.ecr.eu-west-3.amazonaws.com/abcd:latest
	@docker logout 012345678912.dkr.ecr.eu-west-3.amazonaws.com 2>/dev/null || true
deploy-raw: deploy-code invalidate-cache

generate-env-local: ## Generate the .env.local file based on dynamic configuration
	@../node_modules/.bin/env GATSBY_ > ./.env.local
	@../node_modules/.bin/generate-vars-from-terraform-outputs ../outputs/$(env) ./terraform-to-vars.json >> ./.env.local

install: ## Install the Javascript dependencies
	@yarn --silent install

invalidate-cache: ## Invalidate the CloudFront CDN cache
	@AWS_PROFILE=$(AWS_PROFILE) aws cloudfront create-invalidation --distribution-id $(cloudfront) --paths '/*'

pre-install:
	@true

serve: ## Serve
	@yarn --silent serve

start: ## Start (local)
	@yarn --silent start

test: ## Execute the tests
	@yarn --silent test --all --color --coverage --detectOpenHandles
test-dev: ## Execute the tests
	@yarn --silent test --all --color --detectOpenHandles

.DEFAULT_GOAL := install
.PHONY: build build-code build-publish-image \
		deploy deploy-code deploy-publish-image deploy-raw \
		generate-env-local \
		install \
		invalidate-cache \
		pre-install \
		serve \
		start \
		test test-dev
