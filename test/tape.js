// Hey, you're getting better at this.
const test = require('tape')
const stRequest = require('supertest');
const server = require('../server/server');
const {
  db, ToDo
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
  ToDo.create({
    title: 'A ToDo',
    body: 'Some stuff to remember',
    completed: false,
    dueDate: Date.now(),
  }, (err) => {
    t.error(err, 'No Errors on create');
    ToDo.findOne({}, (err, data) => {
      t.ok(data.title, 'DB stores Titles');
      t.ok(data.body, 'DB stores Body');
      t.notOk(data.completed, 'DB stores Completion Boolean');
      t.end();
    });
  });
});
test('GET to /todo should return an array of todo objects', (t) => {
  stRequest(HOST)
    .get('/todo')
    .expect('Content-Type', /application\/json/)
    .expect(200)
    .end((err, res) => {
      console.log(res.body);
      t.error(err, 'No Errors on GET /todo');
      t.ok(res.body[0].title, 'Server Returns Titles');
      t.ok(res.body[0].body, 'Server Returns Body');
      t.end();
    });
});
test('POST to /todo with improper format should return error & not write DB', (t) => {
  const badObj = {
    body: 'Do some stuff',
    ok: 'some stuff',
    notok: 'Totally Wrong',
  };
  const errObj = {
    error: 'Malformed ToDo in post reuqest',
  };
  stRequest(HOST)
    .post('/todo')
    .send(badObj)
    .expect('Content-Type', /application\/json/)
    .end((err, res) => {
      t.equal(res.statusCode, 401, '401 Code returned');
      ToDo.find({}, (err, data) => {
        t.equal(data.length, 1, 'Malformed entry not added to DB!');
        t.end();
      });
    });
});
test('POST to /todo with proper format should return todo & write DB', (t) => {
  const goodObj = {
    title: 'Another Awesome ToDo',
    body: 'Some more stuff to remember',
    completed: false,
    dueDate: Date.now(),
  };
  stRequest(HOST)
    .post('/todo')
    .send(goodObj)
    .expect('Content-Type', /application\/json/)
    .expect(200)
    .end((err, res) => {
      console.log(res.body);
      t.equal(res.body.title, goodObj.title, 'Todo Obj returned.');
      ToDo.find({}, (err, data) => {
        t.equal(data.length, 2, 'New entry added to DB!');
        t.end();
      });
    });
});
test('Teardown', (t) => {
  ToDo.remove({}, (err) => {
    t.error(err, 'No error on db clear');
    db.close();
  });
  server.close();
  t.equal(true, true, 'Server closed gracefully');
  t.end();
});
