prefix ?= myprefix

export B_C
export a

install:
	@echo "Hello world!"

.DEFAULT_GOAL := install
.PHONY: install
