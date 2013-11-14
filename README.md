CovalentJS - a Two-Way Data-Binding MVVM Framework
==================================================

CovalentJS (as in [covalent bond](http://en.wikipedia.org/wiki/Covalent_bond)) is a Javascript two-way data-binding
framework.


Dependencies
============

CovalentJS is currently dependent on the following external libraries

* [jQuery](http://jquery.com)
* [RequireJS](http://requirejs.org)

It is written in CoffeeScript, and built using [`Amdee`](http://github.com/yinso/amdee.git). `Amdee` helps simplify
writing scripts in NodeJS format and have it converts into AMD format if you choose to use it.

Installation
=============

You can either download or clone the repo, or you can use this as a node module

    npm install covalent

It'll be in the usual `node_modules` location after installation. DO NOTE that while `Covalent` is designed to work
with NodeJS environment, your usage is much more likely to be browser-based, and in which case manually copying the
files from the lib directory is often easier.

The `lib` directory holds all the files needed for covalent to work

* `require.js` - version 2.11
* `jquery.js` - version 1.7.2
* `covalent.js` - the core covalent library
* `builtin.js` - NodeJS compatible layer for browser

Copy these files over to your script location. You can use your version of `require.js` and `jquery.js`. However, the
library is not tested for any other versions at this time. Pull request welcomed.

Usage
=====

Look at the `example/test.html` to start.

You should prepare to have a starter script (something like a `main.js` or `main.coffee`) to drive the usage of `Covalent`.

Let's assume the following layout for this usage purpose

    /index.html
    /js/main.js
    /js/covalent.js
    /js/builtin.js
    /js/require.js
    /js/jquery.js

In your html, include the following line

    <script src="js/require.js" data-main="js/main.js"></script>

Depending on your particular layout, you might also need to configure requireJS with appropriate configuration. For this
example - you should have the following to start your `main.js` script

    require.config({
      "path": {
        "covalent": "js/covalent",
        "builtin": "js/builtin",
        "jquery": "js/jquery"
      }
    });

You can choose to write `main.js` configuration manually, or you can use [Amdee](http://github.com/yinso/amdee.git) to streamline
the process. If you choose to use `amdee`, then it'll be a NodeJS package you are writing. We'll come back to this a bit later.

Writing Module Manually
---------------------------

If instead you want to write this manually, then you'll need to be familiar with how to write an AMD module.  It'll look like
the following

    // main.js
    // ... add the above require config here
    define(['require','builtin','jquery','covalent'], function(require) {
       // ... your module body goes in here.
    });

Take a look at the `example/example.js` for a more detailed example.

Writing Module via AMDEE
----------------------------

As stated earlier, Amdee (pronounced A-M-D) is designed to facilitate writing AMD modules in NodeJS style, in other words,
it handles the conversion of the script for you. So instead of writing the above out manually, you'll simply write out the
module body, and then invoke `amdee` to handle the conversion for you into the above format.

### Package.JSON

In your `package.json`, define the following:

    "amdee": {
       "main": <path_to_your_main_script>
       "skip": <an_array_of_external_packages_to_be_skipped>
       "requireJS": <the_above_requireJS_configuration>
    }

`amdee` will look into your `package.json` for the `amdee` key, and use it to generate the modules for you.

You just need invoke the following

    amdee --source <path_to_package> --target <target_output_directory> --recursive

And `amdee` will pull all the referenced modules into the `target_output_directory`.

### Start the Covalent Runtime.

So, let's see what the module body of main.js will look like. You would start with the following initiation.

    // main.js
    var $ = require('jquery');
    var Runtime = require('covalent');
    var runtime = new Runtime($);

The first couple of lines ought to be straight forward - it's NodeJS's way of requiring a module. To use `covalent` you'll
load `jquery` and `covalent`, and then pass the instantiated jQuery object for covalent to instantiate.

You might wonder why we don't just use jQuery globally. The reason is because we design covalent to also function on the
server-side, where the jQuery object needs to be instantiated per request. This way, we are certain to have the right copy
for binding purposes.

(It also mean you can actually use any other jQuery-compatible libraries; potentially multiple libraries at once!)

### Covalent Templates

Covalent comes with its own template system, along with a data-binding language. Let's quickly take a look what a template
looks like.

In your html file, include the following

    <script type="text/template" data-template-name="foo">
      <p>This is a template</p>
    </script>

Covalent loads template via the script elements (which are declared with type=`text/template` so browsers won't process them).
You can have arbitrary number of templates.

To load the templates, in your `main.js`, add

    runtime.loadTemplates();

Then you can refer to each template by name, generally with the `renderView` function.

    runtime.renderView(<element_to_append_to>, <template_name>);

### Document as a Template

The HTML document itself *can* also be a template, but as this will be unnamed (and likely only one single copy), you'll
initiated it via `initializeView`

    runtime.initializeView(document);

### Data Proxy

By default, data are proxied via `runtime.context`. You can proxy the data to arbitrary depth.

    runtime.context.set('foo', {bar: 1, baz: 'hello world'});
    runtime.context.get('foo'); // {bar: 1, baz: 'hello world'}
    runtime.context.get('foo.bar'); // 1
    // context works with array too!
    runtime.context.set('foo.baz', [{name: 'test', item: {sku: '10100u', price: 50}}, {name: 'stuff', item: {sku: '10875', price: 100}}]);
    runtime.context.get('foo.baz'); // the same array as above.
    runtime.context.get('foo.baz.1.item.sku'); // returns '10875'. The path is delineated by '.', even the array index.

To proxy any of your data, just proxy it via `runtime.context.set` to a particular path. Keep in mind that the parent
object needs to be already exist, or the call will error. In other words, if you set it to `this.is.the.dest`, then
`this.is.the` needs to point to an existing object.

### Data-Binding

Okay, the fun part of data binding.

Let's say we have the following data being proxied to `account`.

    { name: 'sunkist', id: '100001', projects: [] }

And we want to show `account.name` and `account.id` via binding, this is what you write

    <p>My account name is <b data-bind="@text $account.name" />, and my ID is <b data-bind="@text $account.id" />.</p>

You'll see the following

* My account name is **sunkist** and my ID is **100001**.

The binding expression is defined in the `data-bind` attribute of the element. Covalent will parse and compile the expression
into the appropriate binding object for the element.

You might have noticed the `@text` directive. It means updating the `innerHTML` of the element to the immediately-following expression,
in this case it's `$account.name`.

The expression that starts with a dollar-sign (`$`) in Covalent represents the proxied data. Basically, the above means
`runtime.context.get('account.name')`. We can retrieve value from proxied data, and we can set value against the proxied data.

To retrieve the value, just reference it via the dollar-sign as above.

To set the value, put the dollar-sign expression on the left hand side of an assignment, such as follows:

    $account.name = 'Covalent'


If you want to bind a text field so you can edit the name, you just use the following

    <div>Account Name:
      <input data-bind="
      @attr {
        value: $account.name
      }

      @on {
        keyup: $account.name = this.value
      }

      " /></div>

The syntax is patterned after CSS - a good part of the code that you'll write will be very much `<property>: <expression>`.
Covalent extends the CSS syntax to organize the grouping of the type of bindings. `@attr` bindings are for modifying attributes
of the element, and `@on` bindings are expressions triggered via the event named by the `<property>`. So the above reads:

* When `$account.name` (which maps to `runtime.context.get('account.name')`) changes, update the `value` attribute of the element
* When `keyup` event occurs on the element, assign `$account.name` to `this.value`, which means the value from the `value` attribute of the element




