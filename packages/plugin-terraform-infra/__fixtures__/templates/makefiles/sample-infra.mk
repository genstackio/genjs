prefix ?= myprefix
env ?= dev
layer ?= "all"
layers ?= $(shell AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ../node_modules/.bin/tflayer $(env) list-layers)
AWS_PROFILE ?= $(prefix)-$(env)

all:
	@true

apply: ## Execute terraform-apply on all the specified layers of the specified env
	@AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ../node_modules/.bin/tflayer $(env) apply $(layer)

destroy: ## Execute terraform-destroy on all the specified layers of the specified env
	@AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ../node_modules/.bin/tflayer $(env) destroy $(layer)

generate: ## Generate the Terraform source code using tfgen
	@../node_modules/.bin/tfgen ./config.json layers environments

get: ## Execute terraform-get on all the specified layers of the specified env
	@AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ../node_modules/.bin/tflayer $(env) get $(layer)

init: ## Execute terraform-init on all the specified layers of the specified env
	@AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ../node_modules/.bin/tflayer $(env) init $(layer)
init-full: ## Execute terraform-init on all the specified layers of the specified env
	@AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ../node_modules/.bin/tflayer $(env) init-full $(layer)
init-full-upgrade: ## Execute terraform-init on all the specified layers of the specified env (with upgrade)
	@AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ../node_modules/.bin/tflayer $(env) init-full-upgrade $(layer)
init-upgrade: ## Execute terraform-init on all the specified layers of the specified env (with upgrade)
	@AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ../node_modules/.bin/tflayer $(env) init-upgrade $(layer)

list-layers: ## List all terraform layers
	@AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ../node_modules/.bin/tflayer $(env) list-layers

output: ## Display all the outputs of the specified terraform layer
	@AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ../node_modules/.bin/tflayer $(env) output $(layer)
output-json: ## Export all the outputs of the specified terraform layer in JSON
	@AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ../node_modules/.bin/tflayer $(env) output-json $(layer)

outputs: ## Generate the outputs directory from all the Terraform outputs
	@mkdir -p ../outputs/$(env)
	@$(foreach l,$(layers),echo "[$(env)] Saving outputs of layer '$(l)'..." && AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ../node_modules/.bin/tflayer $(env) output-json $l > ../outputs/$(env)/$(l).json;)

plan: ## Execute terraform-plan on all the specified layers of the specified env
	@AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ../node_modules/.bin/tflayer $(env) plan $(layer)

pre-install:
	@true

provision: init sync
provision-full: init-full sync-full

refresh: ## Execute terraform init/plan/apply on all the specified layers of the specified env
	@AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ../node_modules/.bin/tflayer $(env) refresh $(layer)

sync: ## Execute init/plan/apply(if need) on all the specified layers of the specified env
	@AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ../node_modules/.bin/tflayer $(env) sync $(layer)
sync-full: ## Execute init/plan/apply(if need) on all the specified layers of the specified env
	@AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ../node_modules/.bin/tflayer $(env) sync-full $(layer)

update: ## Execute terraform-update on all the specified layers of the specified env
	@AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ../node_modules/.bin/tflayer $(env) update $(layer)

.PHONY: all \
		apply \
		destroy \
		generate \
		get \
		init init-full init-full-upgrade init-upgrade \
		list-layers \
		output output-json \
		outputs \
		plan \
		pre-install \
		provision provision-full \
		refresh \
		sync sync-full \
		update