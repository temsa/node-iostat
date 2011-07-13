var vows = require("vows"),
    assert = require("assert"),
    iostat = require("../index");

vows.describe('iostat').addBatch({
   'with ["-x","-m"]': {
        topic: function () {iostat(["-x","-m"]).on('data', this.callback);},
        'we get no error, but an object': function (err, data) {
            assert.isNull   (err);
            assert.isObject (data);
        },
        'with some information about the cpu i/o': function (err, data) {
            assert.isObject (data.cpu);
        },
        'like the idle time percentage ': function (err, data) {
            assert.isNumber (data.cpu['%idle']);
        }
    }
}).export(module);