import { ModeOfOperation, utils, ByteSource } from 'aes-js';

export default class vanmoofcrypto {
  _aes: ModeOfOperation.ModeOfOperationECB;

  constructor(encryptionKey: string) {
    this._aes = new ModeOfOperation.ecb(new Uint8Array(Buffer.from(encryptionKey, 'hex')))
  }

  encrypt(bytes: ByteSource) {
    return this._aes.encrypt(bytes)
  }

  decrypt(bytes: ByteSource) {
    return this._aes.decrypt(bytes)
  }

  getUtils() {
    return utils
  }
}