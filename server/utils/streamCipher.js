
module.exports = { encrypt: (text) => "ENC_" + Buffer.from(text).toString('hex') };
