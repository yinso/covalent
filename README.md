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

### Start the Covalent Runtime on Server Side.

[`MockQuery`](http://github.com/yinso/mockquery) is designed to specifically work with `Covalent` on the server-side
as a `jQuery` substitute.

    // main.js
    var mockquery = require('mockquery');
    var Runtime = require('covalent');
    var $ = mockquery.readFileSync(<filePath>);
    var runtime = new Runtime($);

Alternatively, you can use `jsDOM` to accomplish the same purpose. `cheerio` does not currently work.

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

#### Working with Arrays

`runtime.context` specifically provide methods to work with arrays. The method names are the same as regular array methods
but with a bit of differences.

In the previous example, `runtime.context.get('foo.baz')` is an array.

To push data to `$foo.baz`, use `push` method as follows.

    runtime.context.push(<key>, [ <data1>, <data2>, ...]);

`runtime.context.push` takes an array as the second element, rather than taking a vararg as regular `Array.push`. This is
because there is a third argument that is meant to pass an event object. This is the same for all mutation methods of
proxy, including `runtime.context.set`.

The other array mutation methods are

    runtime.context.pop(<key>, <event>); // same as the Array.pop() method

    runtime.context.shift(<key>, <event>); // same as the Array.shift() method

    runtime.context.unshift(<key>, <array_of_objects>, <event>); // same purpose as Array.unshift() method.

    runtime.context.splice(<key>, <index>, <number_of_obj_to_remove>, <array_of_objects_to_insert>, <event>); // same purpose as Array.splice

Each of the mutation methods will generate the appropriate events to trigger the data-bindings.

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

### `Each` Binding and `Template` Binding

To work with generating a list, you can use `@each` binding, as well as the `@template` binding.

    // data
    runtime.context.set('projectList', [
      {name: 'project 1', ...} ,
      {name: 'project 2', ...} ,
      ...
    ]);

    // the each binding template
    <ul data-bind="
      @each $projectList
      @template 'projectDetail'
    "></ul>

    // the projectDetail template
    <script type="text/template" name="projectDetail">
    <li data-bind="
      @text $name
    "></li>
    </script>

The appropriate numbers of the `projectDetail` template will be instantiated to match the `projectList` data. As you
manipulate `projectList` via `push`, `pop`, `shift`, `unshift`, and `splice`, the total number of the `projectDetail`
template will be adjusted to match the underlying data accordingly.

You can also specify the `projectDetail` template inline. To do so, just put the template inside, and remove the
`@template` reference.

    // the each binding template with the projectDetail template inline
    <ul data-bind="
      @each $projectList
    ">
        <li data-bind="
          @text $name
        "></li>
    </ul>

### `Widget` Binding

Although you can use Covalent to cover most of the data binding needs and hence removing the needs for you to write
custom UI controls, sometimes you'll need to have custom UI controls due to

* there are a lot of 3rd-party UI controls ready-to-use, and you just want to integrate rather than duplicate the code
* for complex UI logic it can be easier to be done in imperative fashion in JavaScript rather than in declarative fashion
  in Covalent

The `@widget` binding is designed for this specific scenario.  To use the `@wdiget` control, it looks like the following

    <div data-bind="
      @widget {
        appNet: <initialization_data_object>
      }
    "></div>

The above code will create an widget of the type `appNet` and pass in the `<initialization_data_object>` to initialize
the widget.  Within the widget you'll have full lower-level control over the covalent runtime.

A generic widget will look like the following

    function appNet(element, runtime, options) {
      this.element = element;
      this.runtime = runtime;
      this.options = options || {};
      // do initialization and anything else.
    }

    appNet.prototype.destroy = function() {
      // clean up after the app
    }

    Runtime.registerWidget('appNet', appNet);

The widget constructor expects 3 arguments

* `element` that the widget will be bound to
* `runtime` that represents the current covalent runtime
* `options` that represents the options that you pass in from the widget declaration.

Note that you can use proxied value for the `initialization_object`, but it will not be updated upon subsequent
mutation.

## Routing

Covalent comes with its own routing capability that allows you to create client-side routing. The routing is similar
to [`ExpressJS`](http://expressjs.com) but due to it being tuned for client-side, it doesn't look exactly the same.

> TODO FIll In Routing





