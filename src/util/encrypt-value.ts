import sodium from 'libsodium-wrappers';

export function encryptValue(publicKey: string, value: string) {
  const keyBytes = Buffer.from(publicKey, 'base64');
  const secretBytes = Buffer.from(value);
  const encryptedBytes = sodium.crypto_box_seal(secretBytes, keyBytes);
  return Buffer.from(encryptedBytes).toString('base64');
}
