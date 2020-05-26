// Would be nice to use a namespace, but Babel won't let us…
// Some failed crazy ideas: https://www.typescriptlang.org/play?#code/PTAECEEMGcFMBNQHsB2oAWAXTAHaAuEaTSAYwGskA3WAJwDMAbJAdwDpSkBbYARwFdYxAJapowAGwAmAIwBmKVIDswejExDMAWhaQAnlsxItnFDVrbIWlPy4AjOoeO1I8YQA8tEgCxbhKLQArSCoYUlphHEwAKEw9HFgIGFgZKQAOAGVMCJQAc1AAXlBiHNzo6NJGGGgkuFS00ABvaNBQHAjQjWKSTGFSCABBDIBRQtB68tb24U7E4khe-oj3YUwaguiQVtAABm39hv3WmQkj0ClvM4Uz7z2j70P9gFZT-Z8z0CUpM7S7g8ftgBOV7bGQ7S6g1JnVJ-cbKTZgVpUD7Is6oo7o-aY7bYpEoj4ANUJxLORNJJKOZMppJa2wARDtUnJvC8lGlAQNwABhAAiwwAYgBxAASAEkAFIAaQAMgBZAByAHkAAoARQAShkACoAVQJAHUABoATQAWpA7KR4LB6Ll0MJAuRGFwUEgcLxaMR+FQWO49AAvACEAAEAMQAEgApAA9ABkACoABQASgA+gBqLQFAA0bGAAB4AHwAfgA3PgAOQAbQAuo0AL4AHwAhYAiQgAxQAiwB4RABygBtgCICABVAC7AAZEAEbAMqAgEQiAB1gAICAClAA-AAPAAGqAN0AU4A+4AgIkASYAASsAYEQAGsAlcCACSIAOeALCJANREAFbACZEgFMiV8AMbpk26BY+lAehaG4eVbAcWgxkTGwuHwUA4Kg5MEKgOp0iyUpCkLJpaVaYR6FARNhGgeVIHlRMIPsOhYNsZNk1ARtG0Q2xCgKIobEYRhGOYuC2KKKioLYZVFQyUUtVFAlhlTUV5X5WTxONHiWK4UB812BjaFgTB+FoFAANaRhtNAZZVlALZGGEchEgrNxclWCts2QFBGD0UB-GKbhEldAJrVIYQuEgbiXDcdw8NAIzMBMoRhHgfggrGWUFnQNgmCQJBaForhk3CyLougfhGCiooKwrAzQHgJBcLOUzivy2L4u4yNahSdI2HAIZhnC1otIKoqxjQ1q0jYWroA4dBIFoAZMETWqGPTfLCpiGqYrihKiiSzAUrSjLZtWxrzJa+p2s6nL9nrUAWHtIyiN6hqEsDdiNPKrSdL0xaitpesAKMQS6Bg0bUOSepMP8XIUJUqDsOq7Y8t6paxh2cLTGIEyPFWaABloaCilGthoBwSyZtKnLwvoDKiLy4REdLdy1LRlY1jYIy8i22n03TYQGOaFa+rqva+dAeMjrajqRnmkXhrx-xrXcRV6Fm9G1irYQazO7ZvvC17dLQeGitLL7ok1ypqlALlaHiIwkpQSBcn+nnAMWUAYD0FB+jtlA6AWWBJVgeJIGEaCUwQ5UwK4EjYHzc3LaQX29GVAPaBwh2eu0nXQHCGP8f4OxMCMtgPa9jQ48TFPthtrhYAQithl5DIBkc7rEMgSv4C5XSaGr5UtDkNJvEb86nOyQQnKrCtoGEXIUEc0AK3MAi9ArNXDdpeYnZdt3QDtzB1UgFhlRzyzSDjojrP9wOEOjqJY79hPA+5pvgHjJuUainAc55BZIDGPeA6izPr7Z1zvnWA7gcAZUwCXCsLgWAzzPjgRObB352CPnHdWrQtj6kSJwQqiBKqeUriBSAbs3IIPgG4PITk7D8CihPN2iQWCJHIK6FgoAtoLFAGfUA1D6D0H+iRZ2jBdB6BqEgQiLNchbVAICJQ2ZwoWW0uPUAgR+CozIWwlgVV-R0CQEIZybD0CJFgCgRAxDECkCCtxMy394D6DYMjMQb9XAUNyNKYxkj0AwRkDIUAWgiLIM-iQNgdg9AaDcazTxzVvH0VAFEmQDiUCox4XwnGiFYCsPAPwXhNEAlf2CaE2A4SPGgAWmQlxRStroIzo4zhftMnZNSZ7VhOp-CYDSFjFwehEy5JIFU5JdB8baUTGfepKSnI7D6VklJgyZpNNAB0-Q3TnFgwqegZMqVhBcUTBMpyPTID5LCe4ypWs07vRGVMgZRhQZ5BTE3eMwAEmo3ADqfk-JhjqlTNKYY8oxgyMeW-D+X8f66DMgAowQC86wDYKA8BFgoEwLgX7BBgckGHz6Gg-53CLmNPSaAFpKA2kLK6XsqpeUShjFKmTCmiYqYDReW8j5Xyfl+JkLTamOEdhst8UUKQD8PjdGgumIoiZEz9NoCrGsal1INFjLsdwvCGLMVFdilWvjxiStlTseV9B6JsCudkMGiYThVO+vsclQqsUNKrDsGseqkDXNyEaiQDEthIHIZDOggAUAlQNg4hFYorbzaInBAJy3poBKIbY2YgkD52YI68eJALBgwrDlK+VtiG2wGYXFwxckWJxTHqwxKBhl5sDtDNNSBraZtoAXbSu995ouPn7Et59aD0Sbvyzt-LC3GJbZhaGKMY1QrjX27I9EgA

import DB from './db'
import { SignedMessage } from './RTCManager'

export default class Crypto {
  private static readonly ECDSA_KEYGEN_CONFIG: EcKeyGenParams = {
    name: 'ECDSA',
    namedCurve: 'P-384'
  }
  private static readonly ECDSA_SIGN_CONFIG: EcdsaParams = {
    name: 'ECDSA',
    hash: 'SHA-256'
  }

  static async generateKeypair (): Promise<CryptoKeyPair> {
    return crypto.subtle.generateKey(this.ECDSA_KEYGEN_CONFIG, true, ['sign', 'verify'])
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
    return buffer.reduce((acc, byte) => {
      // Convert the buffer to a string by splitting each byte into 4-bit pieces, then base-16 encoding each
      const low = byte & 0xf
      const high = (byte >> 4) & 0xf
      return acc + high.toString(16) + low.toString(16)
    }, '')
  }

  static async signMessage<T extends string> (message: T) {
    // See https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
    const bufArr = Crypto.strToBuf(message)
    const key = await DB.Instance.getPrivateKey()
    return crypto.subtle.sign(this.ECDSA_SIGN_CONFIG, key, bufArr)
  }

  /**
   * Verifies a {@link SignedMessage}.
   * @param message the message to verify.
   * @param publicKey the public key corresponding to the one used to sign the message.
   * @return true if the signature is verified, and false if it is not.
   */
  static async verifyMessage (message: SignedMessage, publicKey: string) {
    const exportedKey = Uint8Array.from(
      [4].concat( // restore leading 4 that we removed when generating ID
        publicKey.match(/.{1,2}/g) // split string into fragments corresponding to original bytes
          .map(byteStr => ((parseInt(byteStr[0], 16) & 0xf) << 4)
                            | (parseInt(byteStr[1], 16) & 0xf)) // get place values back where they should be
      )
    )
    const key = await crypto.subtle.importKey('raw', exportedKey, this.ECDSA_KEYGEN_CONFIG, true, ['sign', 'verify'])
    const msgBuf = Crypto.strToBuf(JSON.stringify(message.message))
    return crypto.subtle.verify(this.ECDSA_SIGN_CONFIG, key, message.signature, msgBuf)
  }

  private static strToBuf<T extends string> (str: T): Uint16Array {
    const buf = new ArrayBuffer(str.length * 2)
    const bufArr = new Uint16Array(buf)
    for (let i = 0; i < bufArr.length; ++i) {
      bufArr[i] = str.charCodeAt(i)
    }
    return bufArr
  }
}
