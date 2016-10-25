const {
  Work
} = require('./db');
const CLIENT_PATH = __dirname + './../client';
const path = require('path');

const mainView = (req, res) => {
  Work.find({}, (err, works) => {
    if (err) {
      console.log(error);
      return res.render(path.join(CLIENT_PATH, 'main'), {
        flash: 'Error!' + JSON.stringify(err),
      });
    } else {
      let flash = null;
      if (req.session.flash) {
        flash = req.session.flash;
        req.session.flash = null;
      }
      console.log('Flashing: ', flash);
      return res.render(path.join(CLIENT_PATH, 'main'), {
        flash, works,
      });
    }
  });
};

const annotateProcessPost = (req, res) => {
  Work.create({
    title: req.body.title,
    caption: req.body.caption,
    medium: req.body.medium,
    creationDate: req.body.creationDate,
    uris: [{
      href: req.body.uri,
      name: req.body.uriname,
      notes: req.body.urinotes,
    }],
  }, (err, data) => {
    if (err) {
      console.log(error);
      return res.render(path.join(CLIENT_PATH, 'annotate'), {
        flash: {
          title: 'Error!',
          body: err,
        },
        uri: req.body.uri || '',
      });
    } else {
      console.log('posted:', data);
      req.session.flash = `Added new Work: ${req.body.title}!`;
      console.log('session set:', req.session);
      res.redirect('/main');
    }
  });
}
module.exports = {
  mainView, annotateProcessPost, editView, editProcessPost,
};
