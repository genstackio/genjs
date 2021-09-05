var1 ?= 12
var2 = 13

build-custom:
	@custom-build

target1: target1-sub-a target1-sub-b
target1-sub-a:
	@echo "Hello from Target1SubA!"
target1-sub-b:
	@echo "Hello from"
	@echo "Target1SubB!"

.DEFAULT_GOAL := target1
.PHONY: build-custom \
		target1 target1-sub-a target1-sub-b