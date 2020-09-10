const { nextI18NextRewrites } = require('next-i18next/rewrites');

const allLanguages = ['es', 'en'];
const defaultLanguage = 'es';

const localeSubpaths = {};
allLanguages.forEach(l => {
  localeSubpaths[l] = l;
});

const otherLanguages = Object.keys(localeSubpaths).filter(
  l => l !== defaultLanguage
);

module.exports = {
  distDir: 'dist',
  rewrites: async () => nextI18NextRewrites(localeSubpaths),
  publicRuntimeConfig: {
    localeSubpaths,
    defaultLanguage,
    otherLanguages,
    allLanguages
  },
  env: {
    API_URL: process.env.API_URL,
    PORT: process.env.PORT,
    ORGANIZATION_ID: process.env.ORGANIZATION_ID,
    STORE_ID: process.env.STORE_ID
  }
};
