// Hey, you're getting better at this.
const test = require('tape')
const stRequest = require('supertest');
const server = require('../server/server'); // eslint-disable-line

// Configuration stuff
const PORT = process.env.PORT || 3000;
const HOST = `http://localhost:${PORT}`

// Begin Proper Tests
test('Basic GET tests', function(t) {
  stRequest(HOST)
    .get('/index.html')
    .expect('Content-Type', /text\/html/)
    .expect(200)
    .end((err, res) => {
      t.error(err, 'No Errors on getting index.html');
      t.end();
    });
});
test('Teardown', t => {
  server.close();
  t.equal(true, true, 'Server closed gracefully');
  t.end();
})
