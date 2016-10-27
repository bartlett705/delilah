const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/delilah');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'data be hosed, broh:'));
db.once('open', () => {
  console.log('Connected with MongoDB');
});

const workSchema = mongoose.Schema({
  title: { type: String, required: true },
  caption: String,
  medium: String,
  public: Boolean,
  creationDate: { type: Date, default: Date.now },
  uris: Array,
  preview: String,
});
const Work = mongoose.model('Work', workSchema);

const respondWithWorks = (req, res) => {
  Work.find({}, (err, data) => {
    if (err) {
      console.log(error);
      return res.json(err);
    } else return res.json(data);
  });
};

const validateAndCommitPost = (req, res) => {
  Work.create(req.body, (err, data) => {
    if (err) {
      console.log('Validation Error!');
      res.statusCode = (401);
      return res.end();
    }
    else {
      return res.json(data);
    }
  });
}

module.exports = { db, Work, respondWithWorks, validateAndCommitPost };
