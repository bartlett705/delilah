// Hey, you're getting better at this.
const test = require('tape')
const stRequest = require('supertest');
const server = require('../server/server');
const {
  db, Work
} = require('../server/db');

// Configuration stuff
const PORT = process.env.PORT || 3000;
const HOST = `http://localhost:${PORT}`

// Begin Proper Tests
test('Exercise Static fileserving', function(t) {
  stRequest(HOST)
    .get('/index.html')
    .expect('Content-Type', /text\/html/)
    .expect(200)
    .end((err, res) => {
      t.error(err, 'No Errors on getting index.html');
      t.end();
    });
});
test('DB Connection, basic I/O', (t) => {
  Work.create({
    title: 'Two Guise',
    caption: 'A pretty scene',
    medium: 'Clay',
    public: true,
    creationDate: Date.now(),
    uris: [
      {
        href: 'http://codemosey.net',
        name: '500px JPG',
        notes: 'Highly compressed',
      },
      {
        href: 'http://codemosey.net',
        name: '500px JPG',
        notes: 'Highly compressed',

      }],
  }, (err) => {
    t.error(err, 'No Errors on create');
    Work.findOne({}, (err, data) => {
      t.ok(data.title, 'DB stores Titles');
      t.ok(data.caption, 'DB stores Body');
      t.ok(Array.isArray(data.uris), 'DB stores array of URIs');
      t.ok(data.uris[0].href, 'DB stores individual links');
      t.ok(data.public, 'DB stores Public Boolean');
      t.end();
    });
  });
});
test('GET to /db should return an array of work objects', (t) => {
  stRequest(HOST)
    .get('/db')
    .expect('Content-Type', /application\/json/)
    .expect(200)
    .end((err, res) => {
      console.log(res.body);
      t.error(err, 'No Errors on GET /todo');
      t.ok(res.body[0].title, 'Server Returns Titles');
      t.ok(res.body[0].uris[0].href, 'Server Returns Links');
      t.end();
    });
});
test('POST to /db with improper format should return error & not write DB', (t) => {
  const badObj = {
    body: 'Do some stuff',
    ok: 'some stuff',
    notok: 'Totally Wrong',
  };
  const errObj = {
    error: 'Malformed work in post reuqest',
  };
  stRequest(HOST)
    .post('/db')
    .send(badObj)
    .expect('Content-Type', /application\/json/)
    .end((err, res) => {
      t.equal(res.statusCode, 401, '401 Code returned');
      Work.find({}, (err, data) => {
        t.equal(data.length, 1, 'Malformed entry not added to DB!');
        t.end();
      });
    });
});
test('POST to /db with proper format should return Work Object & write DB', (t) => {
  const goodObj = {
    title: 'Tree Ladies',
    caption: 'Another pretty scene',
    medium: 'Marble',
    public: false,
    creationDate: Date.now(),
    uris: [
      {
        href: 'http://codemosey.net',
        name: '1000px PNG',
        notes: 'lightly compressed',
      },
      {
        href: 'http://codemosey.net',
        name: '500px JPG',
        notes: 'Highly compressed',

      },
    ],
  };
  stRequest(HOST)
    .post('/db')
    .send(goodObj)
    .expect('Content-Type', /application\/json/)
    .expect(200)
    .end((err, res) => {
      console.log(res.body);
      t.equal(res.body.title, goodObj.title, 'Work Obj returned.');
      Work.find({}, (err, data) => {
        t.equal(data.length, 2, 'New entry added to DB!');
        t.end();
      });
    });
});
test('Teardown', (t) => {
  Work.remove({}, (err) => {
    t.error(err, 'No error on db clear');
    db.close();
  });
  server.close();
  t.equal(true, true, 'Server closed gracefully');
  t.end();
});
