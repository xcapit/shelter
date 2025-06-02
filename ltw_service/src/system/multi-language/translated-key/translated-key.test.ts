import i18next from 'i18next';
import { MultiLanguage } from '../multi-language';
import { TranslatedKey } from './translated-key';

describe('TranslatedKey', () => {
  const language = 'en';
  const preloadLanguages = ['en', 'es'];
  const debug = true;
  const key = 'keytest';
  const keyinterpolation = 'keyinterpolationtest';

  beforeAll(() => {
    new MultiLanguage(i18next, language, preloadLanguages, debug).init();
  });

  test('translated key to default language (en)', () => {
    const translatedKey = new TranslatedKey(key, i18next);

    expect(translatedKey.toString()).toEqual('hello world');
  });

  test('translated key to es', () => {
    const translateLib = i18next.createInstance();
    new MultiLanguage(translateLib, 'es', preloadLanguages, debug).init();

    const translatedKey = new TranslatedKey(key, {}, translateLib);

    expect(translatedKey.toString()).toEqual('hola mundo');
  });

  test('translated key with interpolated values', () => {
    const translatedKey = new TranslatedKey(keyinterpolation, {fix: "!"}, i18next);

    expect(translatedKey.toString()).toEqual('hello world !');
  });
});
