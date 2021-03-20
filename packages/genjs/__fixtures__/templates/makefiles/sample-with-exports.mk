prefix ?= myprefix

export B_C
export a

all: install

install:
	@echo "Hello world!"

.PHONY: all \
		install
