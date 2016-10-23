const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/marmotify');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'data be hosed, broh:'));
db.once('open', () => {
  console.log('Connected with MongoDB');
});

const todoSchema = mongoose.Schema({
  title: String,
  body: String,
  completed: Boolean,
  addedDate: { type: Date, default: Date.now },
  dueDate: Date,
});
const ToDo = mongoose.model('ToDo', todoSchema);

const respondWithToDos = (req, res) => {
  ToDo.find({}, (err, data) => {
    res.json(data);
  });
};

module.exports = { db, ToDo, respondWithToDos };
