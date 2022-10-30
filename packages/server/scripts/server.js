const Gun = require('gun');

const server = require('http').createServer(Gun.serve(__dirname));
const gun = Gun({web: server.listen("8765")});
