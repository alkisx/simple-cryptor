
const expect = require('chai').expect;
const sc = require('../simple-crypto');

it('should successfully require this package', () => {
  const sc1 = require('../index');

  expect(sc1).to.be.a('function');
  expect(sc1).to.have.property('constructor');
  expect(sc1.prototype).to.have.property('encrypt');
  expect(sc1.prototype).to.have.property('decrypt');
  expect(sc1.prototype).to.have.property('encryptToString');
  expect(sc1.prototype).to.have.property('decryptFromString');

});



it('should create a new instance of SimpleCrypto object without custom config', ()=>{

  const SimpleCrypto = require('../index');

  const ni = ()=> new SimpleCrypto('adfasfasfasfasfsfa435235243525253425');
  expect(new SimpleCrypto('asdfdasfafasfdwfsfasdfdasfasfasdfsdfaasdfsaf'))
    .to.be.an('object');
  expect(ni).to.not.throw();
});

it('shoud create a new instance of SimpleCrypto object with only config.ivSize provided', () => {
  const SimpleCrypto = require('../index');
  const n1 = () =>
    new SimpleCrypto(
      'asdfasdfadsfafdsfafawefaweaweffasdfawefewafadf',
      {
        ivSize: 32
      }
    );

  expect(n1).to.not.throw();
  const sc1 = n1();
  expect(sc1._config.ivSize).to.eq(32);
  expect(sc1._config.algorithm).to.eq(sc1.getDefaultConfig().algorithm);
});

it('should create a new instance of SimpleCrypto object with only config.algorithm provided', ()=>{
  const SimpleCrypto = require('../index');
  const n2 = () =>
    new SimpleCrypto(
      'asdfasdfaf4r34r3423dsgdsgsdgdsgds',
      {
        algorithm: 'aes-256-ctr'
      }
    )

  expect(n2).to.not.throw();
  const sc2 = n2();
  expect(sc2._config.ivSize).to.eq(32);
  expect(sc2._config.algorithm).to.eq(sc1.getDefaultConfig().algorithm);

});


/*it('should end encryption of a string', ()=> {



});*/
