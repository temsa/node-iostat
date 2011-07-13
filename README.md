# Introduction
Wrapper around [iostat]( http://sebastien.godard.pagesperso-orange.fr/man_iostat.html ) for Node,
providing an EventEmitter to get information.

Takes (for now) an Array of iostat arguments as an array (by default ["-x"])
e.g : iostat(['-x','-m','2']);

Data comes back as an event 'data', which provides any error as a first argument
(FIXME: at the moment, null), and the data as a second.

The data argument is an Object of this kind of form :
    { cpu: 
      { '%user': 1.9,
        '%nice': 0.04,
        '%system': 1.12,
        '%iowait': 0.6,
        '%steal': 0,
        '%idle': 96.35 },
      devices: 
        { sda: 
          { 'rrqm/s': 4.25,
            'wrqm/s': 9.09,
            'r/s': 0.78,
            'w/s': 0.73,
            'rMB/s': NaN,
            'wMB/s': NaN,
            'rsec/s': 160.74,
            'wsec/s': 93.84,
            'avgrq-sz': 56.44,
            'avgqu-sz': 0.25,
            await: 54.94,
            svctm: 5.64,
            '%util': 2.55 } } }

This library has essentially been made in order to run in continuous mode,
with options like ["-x","-m","2"].

# Example
    var iostat = require('iostat');
    iostat().on('data', function(err, stats) {
        console.log(stats.devices.sda1["%util"]); //e.g. 0.91 (as a Number, not a String)
    });

# Continuous mode example
    var iostat = require('iostat');
    iostat(['-x','-m','2']).on('data', function(err, stats) {
        console.log(stats);
        if (stats.devices.sda && stats.devices.sda["%util"] > 1)
            throw "Your system is suffering! consider sharding you data!";
    });

# Note
This is an early release, but it's yet mostly usable. Expect maybe some issue like getting sometime NaN rather than the number you expect;
