import { join, dirname } from 'path';
import Backend from 'i18next-fs-backend';
import { fileURLToPath } from 'node:url';
import dotenv from "dotenv";
import process from "process";

dotenv.config();

export class MultiLanguage {

  constructor(
    private _translateLib: any,
    private _language: string = process.env.LANGUAGE!,
    private _preloadLanguages: string[] = process.env.PRELOAD_LANGUAGES!.split(','),
    private _debug = (process.env.PRODUCTION === "0"),

  ) {}

  init() {
    this._translateLib.use(Backend).init(
      {
        initAsync: false,
        lng: this._language,
        fallbackLng: 'en',
        preload: this._preloadLanguages,
        debug: this._debug,
        ns: ['translation'],
        defaultNS: 'translation',
        backend: {
          loadPath: this._loadPath(),
        },
      },
      (err: any) => {
        if (err) console.log(err);
      },
    );
  }

  private _loadPath() {
    return join(
      dirname(fileURLToPath(import.meta.url)),
      'locales/{{lng}}/{{ns}}.json',
    );
  }

  initialized() {
    return this._translateLib.isInitialized;
  }
}
