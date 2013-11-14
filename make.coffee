#!/usr/bin/env coffee
amdee = require 'amdee'

amdee.run # this can automatically handle multiple files!  just need to point to the entry point.
  source: 'src/main.coffee'
  target: 'lib/main.js'
  requireJS:
    paths:
        jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery'
        'coffee-script': 'http://github.com/jashkenas/coffee-script/raw/master/extras/coffee-script'
#        'jquery.livequery': 'https://raw.github.com/brandonaaron/livequery/master/jquery.livequery'
#        'jquery.address': 'https://raw.github.com/bzlib/jquery-address/master/src/jquery.address'
#        'jquery.form': 'http://malsup.github.com/jquery.form'
#        'jquery.autosize': 'http://www.jacklmoore.com/autosize/jquery.autosize'
#        'jquery.nestable': 'https://raw.github.com/dbushell/Nestable/master/jquery.nestable'
#      template: '/views/template'
#      'jquery.ui': 'http://code.jquery.com/ui/1.10.3/jquery-ui'
#        underscore: 'http://underscorejs.org/underscore'
#        handlebars: 'http://cloud.github.com/downloads/wycats/handlebars.js/handlebars.runtime-1.0.rc.1'
#        epiceditor: 'https://raw.github.com/OscarGodson/EpicEditor/develop/src/editor'
#      ckeditor: '/editor/ckeditor'
    shim:
      jquery:
        deps: []
        exports: 'jQuery'
#      'jquery.livequery': ['jquery']
#      'jquery.address': ['jquery']
#      'jquery.form': ['jquery']
    #'jquery.typing': ['jquery']
#      'jquery.nestable': ['jquery']
#      'jquery.hotkeys': ['jquery']
#      'jquery.ui': ['jquery']
#      ckeditor:
#        depends: ['jquery']
#        exports: 'CKEDITOR'
#      template: ['handlebars']
#      underscore:
#        deps: []
#        exports: '_'
#      handlebars:
#        deps: []
#        exports: 'Handlebars'
#      epiceditor:
#        deps: []
#        exports: 'EpicEditor'
#      json5:
#        deps: []
#        exports: 'JSON5'
#      hashtable:
#        deps: []
#        exports: 'Hashtable'
