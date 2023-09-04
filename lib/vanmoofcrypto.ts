import { ModeOfOperation, utils, ByteSource } from 'aes-js';

export default class vanmoofcrypto {
  _aes: ModeOfOperation.ModeOfOperationECB;
  _encryptionKey: Uint8Array;
  _passcode: Uint8Array;

  constructor(encryptionKey: string) {
    this._encryptionKey = new Uint8Array(utils.hex.toBytes(encryptionKey));
    this._passcode = this._encryptionKey.subarray(0, 12);
    this._aes = new ModeOfOperation.ecb(this._encryptionKey);
  }

  getKey() {
    return this._encryptionKey
  }

  encrypt(bytes: ByteSource) {
    return this._aes.encrypt(bytes)
  }

  decrypt(bytes: ByteSource) {
    return this._aes.decrypt(bytes)
  }

  getPasscode(): Uint8Array {
    return this._passcode
  }

  getUtils() {
    return utils
  }
}