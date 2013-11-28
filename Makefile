VPATH=src
BUILDDIR=lib
TESTDIR=test


BEANDIR=.
JSONDIR=.

COFFEE_SOURCES= $(wildcard $(VPATH)/*.coffee)
COFFEE_OBJECTS=$(patsubst $(VPATH)/%.coffee, $(BUILDDIR)/%.js, $(COFFEE_SOURCES))

TEST_COFFEE_SOURCES= $(wildcard $(TESTDIR)/*.coffee)
TEST_COFFEE_OBJECTS= $(patsubst $(TESTDIR)/%.coffee, $(TESTDIR)/%.js, $(TEST_COFFEE_SOURCES))

BEAN_FILES=$(wildcard $(BEANDIR)/*.bean)
JSON_FILES=$(patsubst $(BEANDIR)/%.bean, $(JSONDIR)/%.json, $(BEAN_FILES))

GRAMMAR_DIR=lib

GRAMMAR_FILES=$(wildcard $(GRAMMAR_DIR)/*.pegjs)

all: build

.PHONY: build
build: node_modules objects 

.PHONY: objects
objects: $(JSON_FILES) src/covalent.js lib/covalent.js example/example.js example/package.json

lib/covalent.js: $(COFFEE_SOURCES) src/covalent.js $(TEST_COFFEE_SOURCES)
	./node_modules/.bin/amdee --source . --target lib/covalent.js

example/example.js: example/main.coffee lib/covalent.js example/package.json
	./node_modules/.bin/amdee --source example/main.coffee --target example/example.js

example/package.json: example/package.bean
	./node_modules/.bin/bean --source $<

$(JSONDIR)/%.json: $(BEANDIR)/%.bean
	./node_modules/.bin/bean --source $<

src/covalent.js: src/covalent.pegjs
	./node_modules/.bin/pegjs src/covalent.pegjs src/covalent.js

#	#./node_modules/.bin/mocha --ignore-leaks --compilers coffee:coffee-script --reporter spec  -g exec # proxy runtime parse exec compile # for running test cases that matches the name
.PHONY: test
test: build
	./node_modules/.bin/testlet


.PHONY: clean
clean:
	rm -f $(COFFEE_OBJECTS)

.PHONE: pristine
pristine: clean
	rm -rf node_modules

node_modules:
	npm install -d

$(BUILDDIR)/%.js: $(VPATH)/%.coffee
	coffee -o $(BUILDDIR) -c $<

$(TESTDIR)/%.js: $(TESTDIR)/%.coffee
	coffee -o $(TESTDIR) -c $<

.PHONY: watch
watch:
	coffee --watch -o $(BUILDDIR) -c $(VPATH)

.PHONY: start
start:	all
	./node_modules/.bin/supervisor -w routes,views,lib,src,client -e coffee,hbs,js,json -q run.js
