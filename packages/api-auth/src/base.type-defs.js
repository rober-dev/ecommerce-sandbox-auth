// Vendor libs
const { gql } = require('apollo-server-express');

module.exports = gql`
  # -----------------------------------
  # COMMON DATA
  # -----------------------------------
  enum LANGUAGE {
    es
    en
    de
    fr
    it
    pt
    gl
    ca
    eu
  }
  enum SOCIAL_NETWORK {
    FACEBOOK
    TWITTER
    INSTAGRAM
    GOOGLE
    FOURSQUARE
    SPOTIFY
  }
  enum ROLE {
    ADMIN
    MANAGER
    USER
    GUEST
  }
`;
