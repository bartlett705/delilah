const express = require('express');
// try importing these
const bodyparser = require('body-parser').urlencoded({extended: true});
// Configuration
const PORT = process.env.PORT || 3000;
const server = express();

// Standard Middleware
server.use(express.static(`${__dirname}/../client`));
server.use(bodyparser);

const serverHandle = server.listen(PORT);
console.log('----===***WELCOME***===----');
console.log(`Listening on localhost:${PORT}`);
console.log('---===---===---===---===---');
module.exports = serverHandle;
