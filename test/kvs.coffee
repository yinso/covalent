kvs = require '../src/kvs'

flatObj =
  'avatar.0.height': 15
  'avatar.0.girth': 10
  'avatar.1.eyebrows': 5
  'avatar.1.mouth': 15
  'avatar.2.dress': 10
  'scene.camera-pos-x': 1.5
  'scene.camera-pos-y': 10
  'scene.camera-pos-z': 100
  'animation.0.fps': 12
  'animation.0.name': 'test'
  'animation.0.loop': 1
  'image.width': 240
  'image.height': 296
  'image.type': 'jpg'
  'image.quality': 85
  'test.0': 100
  'test.1': 200
  'test.2': 300

origObj =
  avatar:
    [ {height: 15, girth: 10}
      {eyebrows: 5, mouth: 15}
      {dress: 10}
    ]
  scene:
    'camera-pos-x': 1.5
    'camera-pos-y': 10
    'camera-pos-z': 100
  animation:
    0:
      fps: 12
      name: 'test'
      loop: 1
  image:
    width: 240
    height: 296
    type: 'jpg'
    quality: 85
  test:
    0: 100
    1: 200
    2: 300

unflatObj = kvs.unflatten(flatObj)

describe 'kvs test', () ->
  it 'kvs flatten/unflatten should getback same value', (done) ->
    try
      test.equal flatObj, kvs.flatten(kvs.unflatten(flatObj))
      done null
    catch e
      done e
  it 'transform should return same as kvs', (done) ->
    try
      result = kvs.transform(origObj)
      test.log 'kvs.transform result', result
      test.equal unflatObj, result
      done null
    catch e
      done e
