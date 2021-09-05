env ?= dev

build: clean
	@sh ./bin/build

clean:
	@sh ./bin/clean

deploy:
	@true

install:
	@sh ./bin/install
install-test:
	@true

pre-install:
	@true

test:
	@true
test-ci:
	@true
test-cov:
	@true

.DEFAULT_GOAL := install
.PHONY: build \
		clean \
		deploy \
		install install-test \
		pre-install \
		test test-ci test-cov