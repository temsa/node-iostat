var vows = require("vows"),
    assert = require("assert"),
    iostat = require("../index");

vows.describe('iostat').addBatch({
   'by default': {
        topic: function () {iostat().on('data', this.callback);},
        'we get no error, but an object': function (err, data) {
            assert.isNull   (err);
            assert.isObject (data);
        },
        'with some information about the cpu i/o': function (err, data) {
            assert.isObject (data.cpu);
        },
        'like the idle time percentage ': function (err, data) {
            assert.isNumber (data.cpu['%idle']);
            assert.isTrue (data.cpu['%idle']<=100);
            assert.isTrue (data.cpu['%idle']>=0);
        }
    }
  }).addBatch({
   'with ["-x","-N","-m"] parameters': {
        topic: function () {iostat(["-x","-N","-m"]).on('data', this.callback);},
        'we get no error, but an object': function (err, data) {
            assert.isNull   (err);
            assert.isObject (data);
        },
        'with some information about the cpu i/o': function (err, data) {
            assert.isObject (data.cpu);
        },
        'like the idle time percentage ': function (err, data) {
            assert.isNumber (data.cpu['%idle']);
            assert.isTrue (data.cpu['%idle']<=100);
            assert.isTrue (data.cpu['%idle']>=0);
        },
        'and some devices': function (err, data) {
            assert.isObject (data.devices);
        },
        'which have some stats themselves': function (err, data) {
            for (var key in data.devices) {
                assert.isObject(data.devices[key]);
                assert.isNumber(data.devices[key]["%util"]);
            }
        }
    }
}).export(module);