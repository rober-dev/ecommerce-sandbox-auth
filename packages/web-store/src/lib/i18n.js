const NextI18Next = require('next-i18next').default;
const path = require('path');

const languages = ['es', 'en', 'de', 'fr', 'pt', 'it', 'gl', 'eu', 'ca'];

const NextI18NextInstance = new NextI18Next({
  localeSubpaths: {
    es: 'es',
    en: 'en',
    de: 'de',
    fr: 'fr',
    pt: 'pt',
    it: 'it',
    gl: 'gl',
    eu: 'eu',
    ca: 'ca'
  },
  defaultLanguage: 'es',
  otherLanguages: ['en', 'de', 'fr', 'pt', 'it', 'gl', 'eu', 'ca'],
  interpolation: {
    escapeValue: false
  },
  localePath: path.resolve('public/static/locales')
});

// Trick for avoid console log "react-i18next:: i18n.languages were undefined or empty undefined"
NextI18NextInstance.i18n.languages = languages;
module.exports = NextI18NextInstance;
