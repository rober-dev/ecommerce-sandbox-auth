// Vendor libs
const path = require('path');
const i18next = require('i18next');
const i18nMiddleware = require('i18next-express-middleware');
const Backend = require('i18next-sync-fs-backend');

module.exports = async (
  app,
  pathLocales,
  ns,
  whitelistLangs,
  preloadLangs,
  debug = false
) => {
  // Get always 'common' and 'yup' namespaces for default
  let _ns = ['common', 'yup', 'auth'];

  if (ns && ns.length > 0) {
    _ns = _ns.concat(ns);
  }

  await i18next
    .use(i18nMiddleware.LanguageDetector)
    .use(Backend)
    .init({
      lng: 'es',
      whitelist: whitelistLangs || ['en', 'es'],
      preload: preloadLangs || ['en', 'es'],
      initImmediate: false,
      debug,
      // files to load
      ns: _ns,
      // default namespace (needs no prefix on calling t)
      defaultNS: 'common',
      // fallback, can be a string or an array of namespaces
      fallbackLng: 'en',
      fallbackNS: 'common',
      detection: {
        lookupHeader: 'lng',
        order: ['header']
      },
      saveMissing: true,
      saveMissingTo: 'all',
      backend: {
        // path where resources get loaded from
        loadPath: path.join(pathLocales, './{{lng}}/{{ns}}.json'),
        addPath: path.join(pathLocales, './{{lng}}/{{ns}}.missing.json'),
        jsonIndent: 2
      }
    });
  app.use(i18nMiddleware.handle(i18next));
};
