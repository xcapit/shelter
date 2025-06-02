import i18next from 'i18next';
import {MultiLanguage} from './multi-language';


describe('MultiLanguage', () => {
  const language = 'en';
  const preloadLanguages = ['en', 'es'];
  const debug = true;

  test('MultiLanguage with default values', () => {
    const newMultiLanguage = new MultiLanguage(i18next);

    newMultiLanguage.init();

    expect(newMultiLanguage.initialized()).toEqual(true);
  });

  test('MultiLanguage is initialized', () => {
    const newMultiLanguage = new MultiLanguage(
      i18next,
      language,
      preloadLanguages,
      debug,
    );

    newMultiLanguage.init();

    expect(newMultiLanguage.initialized()).toEqual(true);
  });

  test('MultiLanguage is not initialized', () => {
    const newMultiLanguage = new MultiLanguage(
      i18next.createInstance(),
      language,
      preloadLanguages,
      debug,
    );

    expect(newMultiLanguage.initialized()).toBeFalsy();
  });
});
