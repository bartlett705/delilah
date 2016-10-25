const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/marmotify');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'data be hosed, broh:'));
db.once('open', () => {
  console.log('Connected with MongoDB');
});

const todoSchema = mongoose.Schema({
  title: { type: String, required: true },
  body: String,
  completed: Boolean,
  addedDate: { type: Date, default: Date.now },
  dueDate: Date,
});
const ToDo = mongoose.model('ToDo', todoSchema);

const respondWithToDos = (req, res) => {
  ToDo.find({}, (err, data) => {
    if (err) {
      console.log(error);
      return res.json(err);
    } else return res.json(data);
  });
};

const validateAndCommitPost = (req, res) => {
  ToDo.create(req.body, (err, data) => {
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

module.exports = { db, ToDo, respondWithToDos, validateAndCommitPost };
