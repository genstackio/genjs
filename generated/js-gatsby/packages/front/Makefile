prefix ?= myothercompany
bucket_prefix ?= $(prefix)-someproject
env ?= dev
AWS_PROFILE ?= $(prefix)-$(env)
bucket ?= $(env)-$(bucket_prefix)-front
cloudfront ?= $(AWS_CLOUDFRONT_DISTRIBUTION_ID_FRONT)

all: install

build:
	@yarn --silent build

deploy: deploy-code invalidate-cache
deploy-code:
	@AWS_PROFILE=$(AWS_PROFILE) aws s3 sync public/ s3://$(bucket) --delete

generate-env-local:
	@../node_modules/.bin/env GATSBY_ > ./.env.local
	@../node_modules/.bin/generate-vars-from-terraform-outputs $(env) ./terraform-to-vars.json >> ./.env.local

install:
	@yarn --silent install

invalidate-cache:
	@AWS_PROFILE=$(AWS_PROFILE) aws cloudfront create-invalidation --distribution-id $(cloudfront) --paths '/*'

serve:
	@yarn --silent serve

start:
	@yarn --silent start

test:
	@CI=true yarn --silent test --all --color --detectOpenHandles
test-ci:
	@CI=true yarn --silent test --all --color --detectOpenHandles
test-cov:
	@yarn --silent test --coverage --detectOpenHandles
test-dev:
	@yarn --silent test --all --color --detectOpenHandles

.PHONY: all \
		build \
		deploy deploy-code \
		generate-env-local \
		install \
		invalidate-cache \
		serve \
		start \
		test test-ci test-cov test-dev