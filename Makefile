VPATH=src
BUILDDIR=lib

BEANDIR=.
JSONDIR=.

COFFEE_SOURCES= $(wildcard $(VPATH)/*.coffee)
COFFEE_OBJECTS=$(patsubst $(VPATH)/%.coffee, $(BUILDDIR)/%.js, $(COFFEE_SOURCES))

BEAN_FILES=$(wildcard $(BEANDIR)/*.bean)
JSON_FILES=$(patsubst $(BEANDIR)/%.bean, $(JSONDIR)/%.json, $(BEAN_FILES))

GRAMMAR_DIR=lib

GRAMMAR_FILES=$(wildcard $(GRAMMAR_DIR)/*.pegjs)
#PARSER_FILES=$(patsubst $(GRAMMAR_DIR)%.pegjs, $(BUILDDIR)/%.js, $(GRAMMAR_FILES))
#./node_modules/.bin/amdify --source src/main.coffee --target lib/main.js

all: build

.PHONY: build
build: node_modules objects 

.PHONY: objects
objects: $(JSON_FILES) src/covalent.js lib/main.js

lib/main.js: $(COFFEE_SOURCES) src/covalent.js
	./make.coffee 

$(JSONDIR)/%.json: $(BEANDIR)/%.bean
	./node_modules/.bin/bean --source $<

src/covalent.js: src/covalent.pegjs
	./node_modules/.bin/pegjs src/covalent.pegjs src/covalent.js

.PHONY: test
test: build
	./node_modules/.bin/mocha --ignore-leaks --compilers coffee:coffee-script --reporter spec  -g exec # proxy runtime parse exec compile # for running test cases that matches the name


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

.PHONY: watch
watch:
	coffee --watch -o $(BUILDDIR) -c $(VPATH)

.PHONY: start
start:	all
	./node_modules/.bin/supervisor -w routes,views,lib,src,client -e coffee,hbs,js,json -q server.js
