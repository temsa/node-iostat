var spawn = require('child_process').spawn,
    EventEmitter = require('events').EventEmitter;

function runIOstat(options) {
  options = options||["-x", "-N"];
  process.env.LANG="en_US.utf8";//enforce en_US to avoid locale problem
  
  var emitter = new EventEmitter(),
      iostat  = spawn('iostat', options, {env: process.env});

  
  iostat.stdout.on('data', function (data) {
    //console.log('stdout: ' + data);
    data = data.toString();
    
    var dataPos = data.indexOf("avg-cpu");
    
    if(dataPos > -1)
      emitter.emit('data', null, toObject(data.substring(dataPos)));
  });

  iostat.stderr.on('data', function (data) {
    throw new Error('iostat error: '+ data);
  //  console.error('iostat: ' + data);
  });

  iostat.on('exit', function (code) {
    console.log('child process exited with code ' + code);
  });

  function toObject(output) {
    var lines = output.split('\n');
    
    //console.log(lines);

    var header, values;

    function extractField(field) {
      //console.log(header,values,field);
      var fieldPos = header.indexOf(field);
      if(fieldPos === -1) // => field not in string
        return NaN;
      var fieldEnd = header.indexOf(" ", fieldPos);
      
      if(fieldEnd === -1) // no space => end of line
        fieldEnd = header.length; 
      return Number(values.substring(fieldPos, fieldEnd));
    } 

    var devices={}; //all stats will be stored here with for key the device name
    
    header = lines[3];
    
    lines.slice(4,-2).forEach(function extractPerDeviceStats(val){
      values = val;
      var key = values.substring(0, values.indexOf(" "));
      devices[key] = {
        "rrqm/s": extractField('rrqm/s'),
        "wrqm/s": extractField('wrqm/s'),
        "r/s": extractField('r/s'),
        "w/s": extractField('w/s'),
        "rMB/s": extractField('rMB/s'),
        "wMB/s": extractField('wMB/s'),
        "rsec/s": extractField('rsec/s'),
        "wsec/s": extractField('wsec/s'),
        "avgrq-sz": extractField('avgrq-sz'),
        "avgqu-sz": extractField('avgqu-sz'),
        "await": extractField('await'),
        "svctm": extractField('svctm'),
        "%util": extractField('%util')
      };
      
    });
    
    header = lines[0];
    values = lines[1];
    
    return {//all values stored as an object for easy manipulation
            cpu:{
              "%user": extractField('%user'),
              "%nice": extractField('%nice'),
              "%system": extractField('%system'),
              "%iowait": extractField('%iowait'),
              "%steal": extractField('%steal'),
              "%idle": extractField('%idle')
              },
            devices: devices
          };
  }
  
  return emitter;
}

module.exports = runIOstat;