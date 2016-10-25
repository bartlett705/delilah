const express = require('express');
// try importing these
const bodyparser = require('body-parser').urlencoded({extended: true});
const jsonparser = require('body-parser').json();
const { respondWithWorks, validateAndCommitPost } = require('../server/db');
const views = require('../server/views');
const session = require('express-session');

// Configuration
const PORT = process.env.PORT || 3000;
const server = express();
server.set('view engine', 'ejs');

// Standard Middleware
server.use(express.static(`${__dirname}/../client`));
server.use(bodyparser);
server.use(jsonparser);
server.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))

// api routes
server.get('/db', respondWithWorks);
server.post('/db', validateAndCommitPost)

// view routes
server.get('/main', views.mainView);

server.get('/annotate', (req, res) => {
  res.render('../client/annotate', { flash: null, uri: 'http://google.com' });
});
server.post('/annotate', views.annotateProcessPost);

server.get('/edit/:id', views.editView);
server.post('/edit/:id', views.editProcessPost);

const serverHandle = server.listen(PORT);
console.log('----===***WELCOME***===----');
console.log(`Listening on localhost:${PORT}`);
console.log('---===---===---===---===---');
module.exports = serverHandle;
