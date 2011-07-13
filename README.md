# Introduction
Wrapper around [iostat]( http://sebastien.godard.pagesperso-orange.fr/man_iostat.html ) for Node,
providing an EventEmitter to get information.

Takes (for now) an Array of iostat arguments with a default of : ['-x','-m','2'] 

# Example
    var iostat = require('iostat');
    