import {
  split as shamirSplit,
  combine as shamirCombine,
} from 'shamir-secret-sharing';

const { PRIVATE_KEY_NUM_SHARES, PRIVATE_KEY_THRESHOLD } = process.env;

export class PrivateKeySharding {
  constructor(
    private readonly _numShares: number = +PRIVATE_KEY_NUM_SHARES!,
    private readonly _threshold: number = +PRIVATE_KEY_THRESHOLD!,
  ) {}

  private toUint8Array(data: string): Uint8Array {
    return new TextEncoder().encode(data);
  }

  private fromUint8Array(data: Uint8Array): string {
    return btoa(String.fromCharCode(...data));
  }

  private toUint8ArrayFromBase64(base64: string): Uint8Array {
    return new Uint8Array(
      atob(base64)
        .split('')
        .map((char) => char.charCodeAt(0)),
    );
  }

  async split(privateKey: string): Promise<string[]> {
    return (
      await shamirSplit(
        this.toUint8Array(privateKey),
        this._numShares,
        this._threshold,
      )
    ).map((share) => this.fromUint8Array(share));
  }

  async combine(shares: string[]): Promise<string> {
    return new TextDecoder().decode(
      await shamirCombine(
        shares.map((share) => this.toUint8ArrayFromBase64(share)),
      ),
    );
  }
}
