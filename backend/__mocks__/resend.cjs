class Resend {
  constructor() {
    this.emails = {
      send: async () => ({ id: 'mock-email-id' }),
    };
  }
}

module.exports = { Resend };
