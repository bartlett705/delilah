const { Work } = require('./db');
const CLIENT_PATH = __dirname + './../client';
const path = require('path');

const mainView = (req, res) => {
  Work.find({}, (err, data) => {
    if (err) {
      console.log(error);
      return res.render(path.join(CLIENT_PATH, 'main'), {
        flash: {
          title: 'Error!',
          body: err,
        }});
    } else res.render('../client/main', { flash: null, works: data });
  });
};

const annotateProcessPost = (req, res) => {

}
module.exports = { mainView, annotateProcessPost };
