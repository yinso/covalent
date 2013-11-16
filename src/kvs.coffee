
###
kvs converts between a set of flat key/value pairs that follows a naming convention on the key
into a nested object, and back.

The convention of the key naming goes like this.

key.sub-key1.sub-key2

which will be converted into

{ key: { 'subKey1' : { 'subKey2' ... } }}

The period is the delimiter between the nesting.

The sub-key1 gets converted into camel case if it uses dash as delimiters.

If at a given level, all of the keys are of numeric values, then it will be converted into an Array instead.

Terminology

flatKVS => a flat key/value objects with keys following the patterns described above. Note the value cannot be an array at the moment, as array is used for intermediary representation. It can be converted into a nestedKVS.

nestedKVS => a hierarchical key/value objects. It is basically any JSON object.

interKVS => this is a special form of array object that holds an array that contains splitted keys and the value object, used for unflattening.

An example is a bit easier to see between the 3 forms of data.

flatKVS =
  'avatar.0.height': 15
  'avatar.0.girth': 10
  'avatar.1.eyebrows': 5
  'scene.camera-pos-x': 1.5
  'scene.camera-pos-y': 10
  'scene.camera-pos-z': 100
  'image.width': 240
  'image.height': 296

interKVS =
  [[['avatar','0','height'],15]
   [['avatar','0','girth'],10]
   [['avatar','1','eyebrow'],5]
   [['scene','cameraPosX'],1.5]
   [['scene','cameraPosY'],10]
   [['scene','cameraPosZ'],100]
   [['image','width'], 240]
   [['image','height'],296]
  ]

nestedKVS =
  avatar:
    [{height: 15, girth: 10}
     {eyebrow: 5}]
  scene:
    cameraPosX: 1.5
    cameraPosY: 10
    cameraPosZ: 100
  image:
    width: 240
    height: 296

interKVS is only used when "unflattening" from flatKVS to nestedKVS; "flattening" does not require interKVS. This is not exposed; it is only described as an aid to understand this code.

###

capitalize = (s) ->
  s.charAt(0).toUpperCase() + s.slice(1)

camelCasing = (key) ->
  [head, tail...] = key.split "-"
  res = [head, (capitalize(s) for s in tail)...]
  res.join("")

toInterKVS = (flatKVS) ->
  for k, v of flatKVS
    keys = k.split "."
    [(camelCasing(k) for k in keys), v]

toArray = (obj) ->
  result = []
  for key, val of obj
    result[key] = val # this is first verified.
  result

isInterKVS = (obj) ->
  obj instanceof Array


toNestedKVS = (interKVS) ->
  result = {}
  # first "group" the ary with the same first key.
  # if we have subsequent keys that we still need to combine, keep the same format
  # as the
  for [[key, keys...], val] in interKVS
    if (keys.length == 0)
      if (result[key])
        throw "kvs duplicate #{key}"
      result[key] = val
    else
      if (!result[key])
        result[key] = []
      result[key].push [keys, val]
  # if any of the values are of the intermediate form.
  allNumeric = true
  for key, val of result
    if (isNaN(key, Number))
      allNumeric = false
    if (isInterKVS(val))
      result[key] = toNestedKVS(val)
  if (allNumeric)
    toArray result
  else
    result

unflattenKVS = (flatKVS) ->
  toNestedKVS(toInterKVS(flatKVS))

toObject = (ary) ->
  result = {}
  for [key, val] in ary
    if (result[key]) # this should never occur.
      throw "duplicate flattenKVS key #{key}"
    result[key] = val
  result

unCamelCasing = (key) ->
  key.replace /([A-Z])/g, ($1) -> "-#{$1.toLowerCase()}"

# to nest a kvs we need to work with a prefix.
flattenHelper = (nestedKVS, prefix) ->
  makeKey =
    if (prefix == '')
      (key) -> key
    else
      (key) -> "#{prefix}.#{key}"

  process = (key, val) ->
    newKey = makeKey key
    # when do we stop flattening? when it's not an object anymore...
    if (val instanceof Array) or (val instanceof Object)
      flattenHelper(val, newKey)
    else # we are done flattening!!!
      [[unCamelCasing(newKey), val]]

  result = []
  if nestedKVS instanceof Array
    for val, i in nestedKVS
      result = result.concat process(i, val)
  else
    for key, val of nestedKVS
      result = result.concat process(key, val)
  result

flattenKVS = (nestedKVS) ->
  toObject flattenHelper(nestedKVS, '')

module.exports.unflatten = unflattenKVS
module.exports.flatten = flattenKVS

###
transform the object returned by optimist into what we expect as a full kvs.
optimist also uses '.' as the object separator and automatically aggregate the command line object
the same way.

It differs from kvs in the following significant way:
- it does not convert an object with all numeric indexes into arrays.
- it does not convert dashes into camel casing.

the transform function below handles conversion.
###
transformKVS = module.exports.transform = (obj) ->
  result = {}
  allNumeric = true
  for key, val of obj
    if (isNaN(key))
      key = camelCasing key
      allNumeric = false
    if val instanceof Object
      result[key] = transformKVS val
    else
      result[key] = val

  if (allNumeric)
    out = []
    for key, val of result
      out[key] = val
    out
  else
    result

