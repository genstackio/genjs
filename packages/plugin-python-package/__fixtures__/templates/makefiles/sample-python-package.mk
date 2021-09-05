env ?= dev
pypi_repo = mypypirepo

build: clean
	@source venv/bin/activate && python3 setup.py sdist bdist_wheel

clean:
	@rm -rf dist
clean-venv: ## Create the virtualenv
	@virtualenv venv

create-venv: ## Create the virtualenv
	@virtualenv venv

deploy:
	@source venv/bin/activate && twine upload --repository $(pypi_repo) dist/*

install:
	@source venv/bin/activate && pip3 install -r requirements.txt
install-test:
	@source venv/bin/activate && pip3 install -r requirements.txt -i https://test.pypi.org/simple

pre-install: create-venv

system-install: ## Install Python build-utils
	@python3 -m pip install --upgrade pip
	@python3 -m pip install --upgrade setuptools wheel twine

test:
	@source venv/bin/activate && python -m unittest tests/*.py -v
test-ci:
	@source venv/bin/activate && python -m unittest tests/*.py -v
test-cov:
	@source venv/bin/activate && python -m unittest tests/*.py -v

venv-activate: ## Enable the virtualenv
	@. venv/bin/activate
venv-deactivate: ## Disable the virtualenv
	@deactivate

.DEFAULT_GOAL := install
.PHONY: build \
		clean clean-venv \
		create-venv \
		deploy \
		install install-test \
		pre-install \
		system-install \
		test test-ci test-cov \
		venv-activate venv-deactivate