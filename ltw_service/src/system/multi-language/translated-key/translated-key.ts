import i18next from 'i18next';

export class TranslatedKey {
  constructor(
    private _aKey: string,
    private _valuesForInterpolation: any = {},
    private _translateLib: any = i18next,
  ) {}

  public toString(): string {
    return this._translateLib.t(this._aKey, this._valuesForInterpolation);
  }
}
