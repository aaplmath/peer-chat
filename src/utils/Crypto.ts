// Would be nice to use a namespace, but Babel won't let us…
// Some failed crazy ideas: https://www.typescriptlang.org/play?#code/PTAECEEMGcFMBNQHsB2oAWAXTAHaAuEaTSAYwGskA3WAJwDMAbJAdwDpSkBbYARwFdYxAJapowAGwAmAIwBmKVIDswejExDMAWhaQAnlsxItnFDVrbIWlPy4AjOoeO1I8YQA8tEgCxbhKLQArSCoYUlphHEwAKEw9HFgIGFgZKQAOAGVMCJQAc1AAXlBiHNzo6NJGGGgkuFS00ABvaNBQHAjQjWKSTGFSCABBDIBRQtB68tb24U7E4khe-oj3YUwaguiQVtAABm39hv3WmQkj0ClvM4Uz7z2j70P9gFZT-Z8z0CUpM7S7g8ftgBOV7bGQ7S6g1JnVJ-cbKTZgVpUD7Is6oo7o-aY7bYpEoj4ANUJxLORNJJKOZMppJa2wARDtUnJvC8lGlAQNwABhAAiwwAYgBxAASAEkAFIAaQAMgBZAByAHkAAoARQAShkACoAVQJAHUABoATQAWpA7KR4LB6Ll0MJAuRGFwUEgcLxaMR+FQWO49AAvACEAAEAMQAEgApAA9ABkACoABQASgA+gBqLQFAA0bGAAB4AHwAfgA3PgAOQAbQAuo0AL4AHwAhYAiQgAxQAiwB4RABygBtgCICABVAC7AAZEAEbAMqAgEQiAB1gAICAClAA-AAPAAGqAN0AU4A+4AgIkASYAASsAYEQAGsAlcCACSIAOeALCJANREAFbACZEgFMiV8AMbpk26BY+lAehaG4eVbAcWgxkTGwuHwUA4Kg5MEKgOp0iyUpCkLJpaVaYR6FARNhGgeVIHlRMIPsOhYNsZNk1ARtG0Q2xCgKIobEYRhGOYuC2KKKioLYZVFQyUUtVFAlhlTUV5X5WTxONHiWK4UB812BjaFgTB+FoFAANaRhtNAZZVlALZGGEchEgrNxclWCts2QFBGD0UB-GKbhEldAJrVIYQuEgbiXDcdw8NAIzMBMoRhHgfggrGWUFnQNgmCQJBaForhk3CyLougfhGCiooKwrAzQHgJBcLOUzivy2L4u4yNahSdI2HAIZhnC1otIKoqxjQ1q0jYWroA4dBIFoAZMETWqGPTfLCpiGqYrihKiiSzAUrSjLZtWxrzJa+p2s6nL9nrUAWHtIyiN6hqEsDdiNPKrSdL0xaitpesAKMQS6Bg0bUOSepMP8XIUJUqDsOq7Y8t6paxh2cLTGIEyPFWaABloaCilGthoBwSyZtKnLwvoDKiLy4REdLdy1LRlY1jYIy8i22n03TYQGOaFa+rqva+dAeMjrajqRnmkXhrx-xrXcRV6Fm9G1irYQazO7ZvvC17dLQeGitLL7ok1ypqlALlaHiIwkpQSBcn+nnAMWUAYD0FB+jtlA6AWWBJVgeJIGEaCUwQ5UwK4EjYHzc3LaQX29GVAPaBwh2eu0nXQHCGP8f4OxMCMtgPa9jQ48TFPthtrhYAQithl5DIBkc7rEMgSv4C5XSaGr5UtDkNJvEb86nOyQQnKrCtoGEXIUEc0AK3MAi9ArNXDdpeYnZdt3QDtzB1UgFhlRzyzSDjojrP9wOEOjqJY79hPA+5pvgHjJuUainAc55BZIDGPeA6izPr7Z1zvnWA7gcAZUwCXCsLgWAzzPjgRObB352CPnHdWrQtj6kSJwQqiBKqeUriBSAbs3IIPgG4PITk7D8CihPN2iQWCJHIK6FgoAtoLFAGfUA1D6D0H+iRZ2jBdB6BqEgQiLNchbVAICJQ2ZwoWW0uPUAgR+CozIWwlgVV-R0CQEIZybD0CJFgCgRAxDECkCCtxMy394D6DYMjMQb9XAUNyNKYxkj0AwRkDIUAWgiLIM-iQNgdg9AaDcazTxzVvH0VAFEmQDiUCox4XwnGiFYCsPAPwXhNEAlf2CaE2A4SPGgAWmQlxRStroIzo4zhftMnZNSZ7VhOp-CYDSFjFwehEy5JIFU5JdB8baUTGfepKSnI7D6VklJgyZpNNAB0-Q3TnFgwqegZMqVhBcUTBMpyPTID5LCe4ypWs07vRGVMgZRhQZ5BTE3eMwAEmo3ADqfk-JhjqlTNKYY8oxgyMeW-D+X8f66DMgAowQC86wDYKA8BFgoEwLgX7BBgckGHz6Gg-53CLmNPSaAFpKA2kLK6XsqpeUShjFKmTCmiYqYDReW8j5Xyfl+JkLTamOEdhst8UUKQD8PjdGgumIoiZEz9NoCrGsal1INFjLsdwvCGLMVFdilWvjxiStlTseV9B6JsCudkMGiYThVO+vsclQqsUNKrDsGseqkDXNyEaiQDEthIHIZDOggAUAlQNg4hFYorbzaInBAJy3poBKIbY2YgkD52YI68eJALBgwrDlK+VtiG2wGYXFwxckWJxTHqwxKBhl5sDtDNNSBraZtoAXbSu995ouPn7Et59aD0Sbvyzt-LC3GJbZhaGKMY1QrjX27I9EgA

import DB from './db'
import { SignedMessage } from './RTCManager'

type StringifiedBuffer = string

export default class Crypto {
  private static readonly ECDSA_KEYGEN_CONFIG: EcKeyGenParams = {
    name: 'ECDSA',
    namedCurve: 'P-384'
  }
  private static readonly ECDSA_SIGN_CONFIG: EcdsaParams = {
    name: 'ECDSA',
    hash: 'SHA-256'
  }
  private static readonly PBKDF2_CONFIG: Omit<Pbkdf2Params, 'salt'> = {
    name: 'PBKDF2',
    hash: 'SHA-256',
    iterations: 100000
  }
  private static readonly AES_KEYGEN_PARAMS: AesKeyGenParams = {
    name: 'AES-GCM',
    length: 256
  }
  private static readonly encoder = new TextEncoder()

  static async generateKeypair (): Promise<CryptoKeyPair> {
    return crypto.subtle.generateKey(Crypto.ECDSA_KEYGEN_CONFIG, true, ['sign', 'verify'])
  }

  /**
   * Returns a string representation of the public key of the given keypair.
   * NOTE: this strips the leading 4 from the byte representation.
   * @param keypair the keypair whose public key to convert to a string representation.
   */
  static async getRawPublicKey (keypair: CryptoKeyPair): Promise<string> {
    const pubData = await crypto.subtle.exportKey('raw', keypair.publicKey)
    // For some reason, the first element of pubData is ALWAYS 4. This is probably some sort of internal thing, but it means
    // user IDs are less seemingly unique. Therefore, we drop the 4 and will add it back later when we convert back to CryptoKey.
    const buffer = new Uint8Array(pubData, 1)
    return Crypto.bufToStr(buffer)
  }

  static async signMessage<T extends string> (message: T): Promise<ArrayBuffer> {
    const bufArr = Crypto.encoder.encode(message)
    const key = await DB.Instance.getPrivateKey()
    return crypto.subtle.sign(Crypto.ECDSA_SIGN_CONFIG, key, bufArr)
  }

  /**
   * Verifies a {@link SignedMessage}.
   * @param message the message to verify.
   * @param publicKey the public key corresponding to the one used to sign the message.
   * @return true if the signature is verified, and false if it is not.
   */
  static async verifyMessage (message: SignedMessage, publicKey: StringifiedBuffer) {
    const exportedKey = Crypto.strToBuf(publicKey, [4]) // restore leading 4 that was removed when generating ID
    const key = await crypto.subtle.importKey('raw', exportedKey, Crypto.ECDSA_KEYGEN_CONFIG, true, ['verify'])
    const msgBuf = Crypto.encoder.encode(JSON.stringify(message.message))
    return crypto.subtle.verify(Crypto.ECDSA_SIGN_CONFIG, key, Uint8Array.from(message.signature), msgBuf)
  }

  /**
   * Generates a random key to be used as the database encryption key.
   */
  static async generateDBKey () {
    let arr = new Uint8Array(256)
    crypto.getRandomValues(arr)
    return Crypto.bufToStr(arr)
  }

  /**
   * Generates random bytes for producing salts and initialization vectors.
   */
  static generateRandomBytes (length: number) {
    let arr = new Uint8Array(length)
    crypto.getRandomValues(arr)
    return Crypto.bufToStr(arr)
  }

  /**
   * Encrypts the database encryption key based on a user-supplied password (used to derive a key with PBKDF2) using AES-GCM.
   * @param key the database encryption key (from {@link generateDBKey()}) to encrypt.
   * @param password the password with which to encrypt the key.
   * @param salt the salt to be used in PBKDF2 (generate with {@link generateRandomBytes}).
   * @param nonce the initialization vector to be used in encrypting the key (generate with {@link generateRandomBytes}).
   */
  static async encryptDBKey (key: StringifiedBuffer, password: string, salt: string, nonce: string): Promise<string> {
    const keySigningKey = await Crypto.deriveKeySigningKey(password, salt)
    const aesGcmConfig: AesGcmParams = {
      name: 'AES-GCM',
      iv: Crypto.strToBuf(nonce)
    }
    const keyBuffer = Crypto.strToBuf(key)
    const cipherBuffer = await crypto.subtle.encrypt(aesGcmConfig, keySigningKey, keyBuffer)
    return Crypto.bufToStr(new Uint8Array(cipherBuffer))
  }

  /**
   * Decrypts the database encryption key using a user-supplied password (used to derive a key with PBKDF2) using AES-GCM.
   * @param encryptedKey the encrypted key from the database.
   * @param password the password with which to encrypt the key.
   * @param salt the salt to be used in PBKDF2 (generate with {@link generateRandomBytes}).
   * @param nonce the initialization vector to be used in encrypting the key (generate with {@link generateRandomBytes}).
   */
  static async decryptDBKey (encryptedKey: string, password: string, salt: string, nonce: string): Promise<string | never> {
    const keySigningKey = await Crypto.deriveKeySigningKey(password, salt)
    const aesGcmConfig: AesGcmParams = {
      name: 'AES-GCM',
      iv: Crypto.strToBuf(nonce)
    }
    const encryptedKeyBuffer = Crypto.strToBuf(encryptedKey)
    const cipherBuffer = await crypto.subtle.decrypt(aesGcmConfig, keySigningKey, encryptedKeyBuffer)
    return Crypto.bufToStr(new Uint8Array(cipherBuffer))
  }

  /**
   * Derives a key, based on a user-provided password, with which to encrypt the database encryption key using PBKDF2.
   * @param password the raw user password from which to derive a key.
   * @param salt a random salt for PBKDF2.
   */
  private static async deriveKeySigningKey (password: string, salt: string): Promise<CryptoKey> {
    const passwordBuffer = Crypto.encoder.encode(password)
    const passwordKey = await crypto.subtle.importKey('raw', passwordBuffer, 'PBKDF2', false, ['deriveKey'])
    const derivationConfig: Pbkdf2Params = { ...Crypto.PBKDF2_CONFIG, salt: Crypto.strToBuf(salt) }
    return crypto.subtle.deriveKey(derivationConfig,passwordKey, Crypto.AES_KEYGEN_PARAMS, false,
      ['encrypt', 'decrypt'])
  }

  /**
   * Converts a non-UTF-8 buffer to a base-16 string representation of the buffer.
   *
   * NOTE: if the buffer corresponds to actual encoded text, use {@link TextDecoder}.
   * @param buffer the buffer to convert to a string representation.
   */
  private static bufToStr (buffer: Uint8Array): StringifiedBuffer {
    return buffer.reduce((acc, byte) => {
      // Convert the buffer to a string by splitting each byte into 4-bit pieces, then base-16 encoding each
      const low = byte & 0xf
      const high = (byte >> 4) & 0xf
      return acc + high.toString(16) + low.toString(16)
    }, '')
  }

  /**
   * Converts a base-16 string representation of a byte array to a typed byte array.
   *
   * NOTE: if the string is actual text rather than a base-16 representation of non-UTF-8 buffer data, use {@link TextEncoder}.
   * @param str the string to encode.
   * @param prependElements any elements to prepend to the resulting buffer.
   */
  private static strToBuf (str: string, prependElements: number[] = []): Uint8Array {
    return Uint8Array.from(prependElements.concat(str.match(/.{1,2}/g) // split string into fragments corresponding to original bytes
      .map(byteStr => ((parseInt(byteStr[0], 16) & 0xf) << 4)
        | (parseInt(byteStr[1], 16) & 0xf)))) // get place values back where they should be
  }
}
