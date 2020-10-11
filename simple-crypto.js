const crypto = require('crypto');

const ALGORITHM_DEFAULT = 'aes-256-ctr';
const RANDOM_BYTES_SIZE_DEFAULT = 16;
const SECRET_LENGTH = 32;

const defaultConfig = {
  algorithm: ALGORITHM_DEFAULT,
  ivSize: RANDOM_BYTES_SIZE_DEFAULT,
};

const buildConfig = (config = null) => {
  if(!config) {
    return defaultConfig;
  }
  if(typeof config !=='object') {
    throw new Error('Passed configuration must be an object literal');
  }
  const keys = Object.keys(defaultConfig);
  for(let i = 0; i < keys.length; i++) {
    if(!config[keys[i]]) {
      config[keys[i]] = defaultConfig[keys[i]];
    }
  }

  // some basic filtering/validation:
  config.algorithm = (""+config.algorithm).trim();
  if(!config.algorithm || !config.algorithm.length) {
    throw new Error('algorithm is missing or invalid');
  }

  if(!config.ivSize) {
    config.ivSize = defaultConfig.ivSize;
  }
  config.ivSize = +config.ivSize;

  return config;

}

class SimpleCrypto {

  constructor(secret, config = null) {
    this._config = buildConfig(config);
    secret = ("" + secret).trim();
    if(secret.length<SECRET_LENGTH) {
      throw new Error('Secret cannot be less than ' + SECRET_LENGTH + ' chars');
    }
    this._secret = secret.substr(0, SECRET_LENGTH);
    this._algorithm = this._config.algorithm;

    this._iv = crypto.randomBytes(this._config.ivSize);

    this._cipher = null;

  }

  encrypt(str){
    str +="";
    if(!str.length) {
      throw new Error('String is empty');
    }
    const cipher = crypto.createCipheriv(this._algorithm, this._secret, this._iv);

    const encrypted = Buffer.concat([cipher.update(str), cipher.final()]);

    return {
      iv: this._iv.toString('hex'),
      content: encrypted.toString('hex')
    };
  };

  encryptToString(str) {
    const obj = this.encrypt(str);
    str = JSON.stringify(obj);
    const buff = Buffer.from(str);
    return buff.toString('base64');
  }

  static isHash(hash) {

    return (typeof hash === 'object') &&
      (!!hash.iv && !!hash.content) &&
      (typeof hash.iv === 'string' && typeof hash.content === 'string') &&
      (hash.iv.length > 0 && hash.content.length > 0)
    ;

  }


  decrypt(hash){

    if(!SimpleCrypto.isHash(hash)) {
      throw new Error('Hash is invalid');
    }

    const decipher = crypto.createDecipheriv(this._algorithm, this._secret, Buffer.from(hash.iv, 'hex'));

    const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

    return decrypted.toString();
  };

  decryptFromString(str) {
    str = ""+str;
    if(!str.length) {
      throw new Error('String is empty');
    }
    const buff = Buffer.from(str, 'base64');
    const jsonString = buff.toString('ascii');
    const hash = JSON.parse(jsonString);
    return this.decrypt(hash);
  }


  get algorithm() {
    return this._algorithm;
  }

  get iv() {
    return this._iv;
  }

  getDefaultConfig() {
    return defaultConfig;
  }

  static get SECRET_LENGTH()
  {
    return SECRET_LENGTH;
  }

}


module.exports = SimpleCrypto;
