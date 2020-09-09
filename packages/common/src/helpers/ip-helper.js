/* eslint-disable prefer-destructuring */
// Vendor libs
const ipInfo = require('ipinfo');
const logger = require('../logger');

const { NODE_ENV } = process.env;

module.exports.getLocation = async (ip, IPINFO_TOKEN) => {
  // Check IPINFO_TOKEN
  if (!IPINFO_TOKEN) {
    logger.warn(
      `Cannot get ip location because IPINFO_TOKEN environme variable is null or empty`
    );
    return null;
  }

  // Check ip
  if (!ip) {
    logger.warn(`Cannot get ip location from empty ip`);
    return null;
  }

  // Avoid request location from local ips
  if (NODE_ENV !== 'production') {
    return {
      ip,
      city: 'Vigo',
      region: 'Galicia',
      country: 'ES',
      loc: '42.2183379,-8.7019275',
      lat: 42.2183379,
      lng: -8.7019275,
      postal: '36940',
      timezone: 'Europe/Madrid',
      org: 'AS3352 TELEFONICA DE ESPANA',
      hostname: '132.red-79-148-59.dynamicip.rima-tde.net'
    };
  }

  return new Promise(resolve => {
    ipInfo(ip, IPINFO_TOKEN, (err, cLoc) => {
      if (err) {
        // Log error and resolve empty response
        logger.error(`Error trying get ip location. ${err.message || ''}`, err);
        resolve(null);
      }

      if (cLoc) {
        const pos =
          cLoc.loc && cLoc.loc.indexOf(',') > -1 ? cLoc.loc.split(',') : {};
        const result = {
          ip,
          city: cLoc.city || '-',
          region: cLoc.region || '-',
          country: cLoc.country || '-',
          loc: cLoc.loc || '-',
          lat: pos && pos[0] ? pos[0] : null,
          lng: pos && pos[1] ? pos[1] : null,
          postal: cLoc.postal,
          timezone: cLoc.timezone,
          org: cLoc.org,
          hostname: cLoc.hostname
        };

        resolve(result);
      } else {
        // Log error and resolve empty response
        logger.error(
          `IpInfo returns a empty response for ip ${ip} and IPINFO_TOKEN ${IPINFO_TOKEN}`
        );
        resolve(null);
      }
    });
  });
};
