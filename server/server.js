const express = require('express');
// try importing these
const bodyparser = require('body-parser').urlencoded({extended: true});
const jsonparser = require('body-parser').json();
const { respondWithWorks, validateAndCommitPost } = require('../server/db');
const views = require('../server/views');
const session = require('express-session');
const helpers = require('express-helpers');
var multer  = require('multer');
// const busboy = require('connect-busboy');
// Configuration
  // Config Multer's disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './static/uploads');
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.slice(file.originalname.lastIndexOf('.'), file.originalname.length);
    req.body.ext = ext;
    const generatedFileName = `${req.params.id}-${file.fieldname}${ext}`;
    console.log(generatedFileName);
    cb(null, generatedFileName);
  }
});
var upload = multer({ storage: storage })
const PORT = process.env.PORT || 3000;
const server = express();

server.set('view engine', 'ejs');
helpers(server);
// Standard Middleware
server.use(express.static(`${__dirname}/../static`));
// server.use(busboy({ immediate: true }));
server.use(bodyparser);
server.use(jsonparser);
server.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))
// api routes
server.get('/db', respondWithWorks);
server.post('/db', validateAndCommitPost)

// CRUD routes
server.get('/', views.mainView);
server.get('/main', views.mainView);

server.get('/annotate', (req, res) => {
  res.render('../client/annotate', { flash: null, uri: 'http://google.com' });
});
server.post('/annotate', views.annotateProcessPost);

// server.get('/upload_original', views.uploadOriginalView);
// server.post('/upload_original', () => {});

server.get('/edit/:id', views.editView);
server.post('/edit/:id', views.editProcessPost);

server.get('/del/:id', views.delView);
server.post('/del/:id', views.delProcessPost);

server.get('/add_file/:id', (req, res) => {
  res.render('../client/add_file', { flash: null, work: { _id: req.params.id }});
});
server.post('/add_file/:id', upload.single('newfile'), views.addFileProcessPost);

server.post('/add_uri/:id', views.addUriProcessPost);

// handle proper filenameing via multer


const serverHandle = server.listen(PORT);
console.log('----===***WELCOME***===----');
console.log(`Listening on localhost:${PORT}`);
console.log('---===---===---===---===---');
module.exports = serverHandle;
