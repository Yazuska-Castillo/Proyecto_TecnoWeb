import * as CryptoJS from 'crypto-js';

export class CryptoService {
  private static KEY = 'proyecto-hotel';

  static encrypt(data: any): string {
    return CryptoJS.AES.encrypt(JSON.stringify(data), this.KEY).toString();
  }

  static decrypt(cipher: string): any {
    const bytes = CryptoJS.AES.decrypt(cipher, this.KEY);
    const texto = bytes.toString(CryptoJS.enc.Utf8);

    if (!texto) {
      throw new Error('Error al desencriptar datos');
    }

    return JSON.parse(texto);
  }

  static hashPassword(password: string): string {
    return CryptoJS.SHA256(password).toString();
  }
}
