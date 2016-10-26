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
      const flash = req.session.flash || null;
      req.session.flash = null;
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
      id: 0,
      href: req.body.uri,
      name: req.body.uriname,
      notes: req.body.urinotes,
    }],
  }, (err, data) => {
    if (err) {
      console.log(err);
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

const editView = (req, res) => {
  Work.findOne({ _id: req.params.id }, (err, work) => {
    if (err) {
      console.log(err);
      req.session.flash = `error: ${err}`;
      return res.redirect(`/main`);
    } else {
      const flash = req.session.flash || null;
      req.session.flash = null;
      return res.render(path.join(CLIENT_PATH, 'edit'), {
        flash, work,
      });
    }
  });
};

const editProcessPost = (req, res) => {
  Work.findByIdAndUpdate(req.params.id, { $set: {
      title: req.body.title,
      caption: req.body.caption,
      medium: req.body.medium,
      creationDate: req.body.creationDate,
      uris: req.body.uris,
    }}, { new: true }, (err, work) => {
      if (err) {
        console.log(err);
        req.session.flash = `error: ${err}`;
        return res.redirect(`/edit/${req.params.id}`);
      } else {
        console.log('edited:', work);
        req.session.flash = `Edited Work: ${req.body.title}!`;
        console.log('session set:', req.session);
        res.redirect('/main');
      }
    });
}

const delView = (req, res) => {
  res.render(path.join(CLIENT_PATH, 'del'), {
    flash: null, work: { _id: req.params.id }
  });
}

const delProcessPost = (req, res) => {
  Work.findOneAndRemove({ _id: req.params.id }, (err, work) => {
    if (err) {
      console.log(err);
      req.session.flash = `error: ${err}`;
      return res.redirect(`/edit/${req.params.id}`);
    } else {
      req.session.flash = `Deleted Work: ${work.title} !`;
      return res.redirect(`/main`);
    }
  });
}

const addUriProcessPost = (req, res) => {
  Work.findOne({ _id: req.params.id }, (err, work) => {
    const newId = work.uris.length;
    work.uris.push({
      id: newId,
      href: req.body.uri,
      name: req.body.uriname,
      notes: req.body.urinotes,
    });
    Work.findByIdAndUpdate(req.params.id, { $set:
      { uris: work.uris }}, { new: true }, (err, work) => {
        if (err) {
          console.log(err);
          req.session.flash = `error: ${err}`;
        } else {
          console.log('added uri:', work);
          req.session.flash = `Added URI to Work: ${work.title}!`;
          console.log('session set:', req.session);
        }
        return res.redirect(`/edit/${req.params.id}`);
    });
});
}
module.exports = {
  mainView, annotateProcessPost,
  editView, editProcessPost,
  delView, delProcessPost,
  addUriProcessPost,
};
