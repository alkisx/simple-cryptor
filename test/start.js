
const expect = require('chai').expect;
let SimpleCrypto;

const secret1 = 'adfsfa435235243525253425yyyttyyt';
const secret2 = 'fdwfsfasdfdasfasfasdfsdfaasdfsaf';
const longSecret = '95824ebwtiuvyneiteytewy8wtvnweogy7n4otvmgoiughw';
const shortSecret = '435345342532';

const str1 = 'What day is today?';
const str2 = 'Hello World!';

const content1 = 'fasdfasfdsfasfsdafaf';
const content2 = 'asdfasfasfsdafsafe34234';
const iv1 = '4335hfui34534twrewer';
const iv2 = '33432534253ffdsafasf';

it('should successfully require this package', () => {
  SimpleCrypto = require('../index');

  expect(SimpleCrypto).to.be.a('function');
  expect(SimpleCrypto).to.have.property('constructor');
  expect(SimpleCrypto.prototype).to.have.property('encrypt');
  expect(SimpleCrypto.prototype).to.have.property('decrypt');
  expect(SimpleCrypto.prototype).to.have.property('encryptToString');
  expect(SimpleCrypto.prototype).to.have.property('decryptFromString');
  expect(SimpleCrypto).to.have.property('isHash');

});


it('should create a new instance of SimpleCrypto object without custom config', ()=>{

  const ni = ()=> new SimpleCrypto(secret1);
  expect(new SimpleCrypto(secret2))
    .to.be.an('object');
  expect(ni).to.not.throw();
});

it('shoud create a new instance of SimpleCrypto object with only config.ivSize provided', () => {
  const n1 = () =>
    new SimpleCrypto(
      secret1,
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
  const n2 = () =>
    new SimpleCrypto(
      secret2,
      {
        algorithm: 'aes-256-ctr'
      }
    )

  expect(n2).to.not.throw();
  const sc2 = n2();
  expect(sc2._config.ivSize).to.eq(sc2.getDefaultConfig().ivSize);

});

it('should throw an error in case secret is of less than 32 characters long', () => {
  const n = () => new SimpleCrypto(shortSecret);
  expect(n).to.throw('Secret cannot be less than ' + SimpleCrypto.SECRET_LENGTH + ' chars');
});


it('should truncate secret to 32 chars if it les of length less than than', () => {
  const sc = new SimpleCrypto(longSecret);
  expect(sc._secret).to.be.of.length(SimpleCrypto.SECRET_LENGTH);

});

it('should throw an error in case the string to be encrypted does not have a length',  ()=>{
  const sc = new SimpleCrypto(secret1);
  const encFn = () => sc.encrypt("");
  expect(encFn).to.throw("String is empty");
});


it('should end encryption of a string successfully', ()=> {
    const sc = new SimpleCrypto(secret1);
    const enc = sc.encrypt(str1);
    expect(enc).to.have.property('iv');
    expect(enc.iv).to.be.a('string');
    expect(enc.iv.length).to.be.gt(0);
    expect(enc).to.have.property('content');
    expect(enc.content).to.be.a('string');
    expect(enc.content.length).to.be.gt(0);
});

it('should return false in case the hash object is invalid (.isHash())', () => {
  const hash1 = {}

  const isHash = (hash) =>  SimpleCrypto.isHash(hash);

  expect(isHash(hash1)).to.eq(false);
  const hash2 = {iv: iv1};
  expect(isHash(hash2)).to.eq(false);
  const hash3 = {content: content1};
  expect(isHash(hash3)).to.eq(false);
  const hash4 = {iv:'', content: ''};
  expect(isHash(hash4)).to.eq(false);
  const hash5 = {iv:'', content: content1};
  expect(isHash(hash5)).to.eq(false);
  const hash6 = {iv: iv1, content: ''};
  expect(isHash(hash6)).to.eq(false);

});

it('should return true in case the hash object is a valid one (.isHash()', () => {
  const hash = {
    iv: iv1,
    content: content1
  };
  expect(SimpleCrypto.isHash(hash)).to.eq(true);

});

it('should throw an error in case the object to be decrypted (using decrypt()) is not an expected one', () =>{
  const sc = new SimpleCrypto(secret1);
  const enc = sc.encrypt(str1);

  const enc1 = {...enc};
  delete enc1.iv;
  const enc1Fn  = () => sc.decrypt(enc1);
  expect(enc1Fn).to.throw('Hash is invalid');

  const enc2 = {...enc};
  delete enc2.content;
  const enc2Fn = () => sc.decrypt(enc2);
  expect(enc2Fn).to.throw('Hash is invalid');

  const enc3 = {...enc};
  delete enc3.iv;
  delete enc3.content;
  const enc3Fn = () => sc.decrypt(enc3);
  expect(enc3Fn).to.throw('Hash is invalid');


});

it('decryption should return the same value as before encryption', () =>{
  const sc = new SimpleCrypto(secret1);
  const enc = sc.encrypt(str2);
  const dec = sc.decrypt(enc);
  expect(dec).to.eq(str2);
});

it('.encryptToString() should return a string', () => {
  const sc = new SimpleCrypto(secret1);
  expect(sc.encryptToString(str1)).to.be.a('string');
});

it('.encryptToString() should return a string with a length greater than zero', () => {
  const sc = new SimpleCrypto(secret1);
  expect(sc.encryptToString(str1).length).to.be.gt(0);
});

it('.decryptFromString() should throw an error if string passed is empty', ()=>{
  const sc = new SimpleCrypto(secret1);
  const fn = ()=> sc.decryptFromString("");
  expect(fn).to.throw('String is empty');
});

it('.decryptToString() should return the same string before encryptToString()', ()=>{
  const sc = new SimpleCrypto(secret1);
  const enc = sc.encryptToString(str1);
  expect(sc.decryptFromString(enc)).to.eq(str1);
});
