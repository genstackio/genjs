env ?= dev
b ?= develop

build: build-front build-app
build-app: generate-env-local-app
	@make -C app/ build env=$(env)
build-front: generate-env-local-front
	@make -C front/ build env=$(env)

deploy: deploy-front deploy-app
deploy-app: generate-env-local-app
	@set -a && . app/.env.local && set +a && make -C app/ deploy env=$(env)
deploy-front: generate-env-local-front
	@set -a && . front/.env.local && set +a && make -C front/ deploy env=$(env)

generate: ## Generate and synchronize the source code using GenJS
	@yarn --silent genjs

install: install-root install-git install-front install-app
install-app:
	@make -C app/ install
install-front:
	@make -C front/ install
install-git:
	@true
install-root: ## Install the Javascript dependencies
	@yarn --silent install

pre-install: pre-install-root pre-install-git pre-install-front pre-install-app
pre-install-app:
	@make -C app/ pre-install
pre-install-front:
	@make -C front/ pre-install
pre-install-git:
	@true
pre-install-root: install-root

start: start-front
start-app:
	@make -C app/ start env=$(env)
start-front:
	@make -C front/ start env=$(env)

test: test-git test-front test-app
test-app:
	@make -C app/ test
test-front:
	@make -C front/ test
test-git:
	@true

.DEFAULT_GOAL := install
.PHONY: build build-app build-front \
		deploy deploy-app deploy-front \
		generate \
		install install-app install-front install-git install-root \
		pre-install pre-install-app pre-install-front pre-install-git pre-install-root \
		start start-app start-front \
		test test-app test-front test-git