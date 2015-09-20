var should = require("chai").should(),
    expect = require("chai").expect,
    iostat = require("../index");

describe('iostat', function (){

  describe('by default',function (done) {

    it('should return no error, but an object with property cpu', function (done) {
      iostat().on('data',function (err, data) {
        if(err)
          return done(err);

        expect(data).not.to.be.null;
        //data.should.be.an('object').to.include.keys('cpu')
        data.should.be.an('object').with.property('cpu').which.is.an('object');

        ['%user','%nice','%system','%iowait','%steal','%idle'].forEach(function(key) {
          data.cpu[key].should.be.a('number').at.least(0).and.at.most(100)
        })
        done()
      })
    })

  })

  it('should, with ["-x","-N","-m"] parameters return no error but an object with property cpu, and devices with property %util', function(done) {
    iostat(["-x","-N","-m"]).on('data', function(err, data) {
      if(err)
        return done(err);

      expect(data).not.to.be.null;

      data.should.be.an('object').with.deep.property('cpu.%idle').which.is.a('number').at.least(0).and.at.most(100)
      data.should.be.an('object').with.property('devices').which.is.an('object')

      Object.keys(data.devices).forEach(function(key) {
        data.devices[key].should.be.an('object').with.property('%util').which.is.a('number').at.least(0).and.at.most(100)
      })

      done()
    })
  })

})

// .addBatch({
// }).export(module);
