const path = require('path');
const NextI18Next = require('next-i18next').default;
const {
  localeSubpaths,
  defaultLanguage,
  otherLanguages
} = require('next/config').default().publicRuntimeConfig;

module.exports = new NextI18Next({
  otherLanguages,
  localeSubpaths,
  defaultLanguage,
  localePath: path.resolve('./public/static/locales')
});
