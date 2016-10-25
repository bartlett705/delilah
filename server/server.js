const express = require('express');
// try importing these
const bodyparser = require('body-parser').urlencoded({extended: true});
const jsonparser = require('body-parser').json();
// Configuration
const PORT = process.env.PORT || 3000;
const server = express();
const { respondWithToDos, validateAndCommitPost } = require('../server/db');
// Standard Middleware
server.use(express.static(`${__dirname}/../client`));
server.use(bodyparser);
server.use(jsonparser);

// api routes
server.get('/todo', respondWithToDos);
server.post('/todo', validateAndCommitPost)

const serverHandle = server.listen(PORT);
console.log('----===***WELCOME***===----');
console.log(`Listening on localhost:${PORT}`);
console.log('---===---===---===---===---');
module.exports = serverHandle;
