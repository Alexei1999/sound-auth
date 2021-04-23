module.exports = {
  back: {
    subdomain: "<backend url>",
    url: null,
    port: "<backend port>",
  },
  front: {
    subdomain: "<front url>",
    url: null,
    port: "<frontend port>",
  },
  ngrok: "<ngrok token>",
  twilio: {
    number: "<twilio number>",
    account: {
      sid: "<twilio account sid>",
      token: "81262342c247ecdbb49bae34578e638e",
    },
    api: {
      name: "<twilio api name>",
      sid: "<twilio api sid>",
      secret: "<twilio api secret>",
    },
    app: {
      sid: "<twilio app sid>",
    },
  },
};
