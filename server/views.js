const {
  Work
} = require('./db');
const CLIENT_PATH = __dirname + './../client';
const UPLOAD_PATH = __dirname + './../static/uploads';
const HOST = 'http://localhost:3000';
const path = require('path');
const fs = require('fs');
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
    uris: [],
  }, (err, data) => {
    if (err) {
      console.log(err);
      return res.render(path.join(CLIENT_PATH, 'annotate'), {
        flash: {
          title: 'Error!',
          body: err,
        },
        uri: '',
      });
    } else {
      console.log('posted:', data);
      return res.render(path.join(CLIENT_PATH, 'add_file'), {
        flash: null,
        work: data,
      });
    }
  });
}

// req.session.flash = `Added new Work: ${req.body.title}!`;
// console.log('session set:', req.session);
// res.redirect('/main');

const editView = (req, res) => {
  Work.findOne({
    _id: req.params.id
  }, (err, work) => {
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
  console.log('RECD OBJ:', req.body);
  Work.findByIdAndUpdate(req.params.id, {
    $set: {
      title: req.body.title,
      caption: req.body.caption,
      medium: req.body.medium,
      creationDate: req.body.creationDate,
      uris: req.body.uris,
      preview: req.body.preview || '',
    }
  }, {
    new: true
  }, (err, work) => {
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
    flash: null,
    work: {
      _id: req.params.id
    }
  });
}

const delProcessPost = (req, res) => {
  Work.findOneAndRemove({
    _id: req.params.id
  }, (err, work) => {
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
  Work.findOne({
    _id: req.params.id
  }, (err, work) => {
    const newId = work.uris.length;
    work.uris.push({
      id: newId,
      href: req.body.uri,
      name: req.body.uriname,
      notes: req.body.urinotes,
    });
    const setObj = {
      uris: work.uris,
    };
    console.log('uripreview: ', req.body.uripreview);
    if (req.body.uripreview === 'on') setObj.preview = req.body.uri;
    console.log('setObj:', setObj);
    Work.findByIdAndUpdate(req.params.id, {
      $set: setObj
    }, {
      new: true
    }, (err, work) => {
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
const addFileProcessPost = (req, res) => {
  // req.busboy.on('field', function(fieldname, val) {
  //   req.body['fieldname'] = val;
  // });
  // req.pipe(req.busboy);
  // req.busboy.on('file', (fieldname, file, filename) => {
    console.log('body:', req.body);
    // const newFileStream = fs.createWriteStream(newPath);
    // file.pipe(newFileStream);
    // newFileStream.on('close', () => {
    //   console.log('upload complete...');
      Work.findOne({
        _id: req.params.id
      }, (err, work) => {
        // construct a new path to use for the filesystem and URI
        const newPath = `${work._id}-${req.body.uriname.replace(/\s/g, '-')}${req.body.ext}`
        // open the uploaded file and move it to its proper home
        fs.readFile(path.join(UPLOAD_PATH,`${work._id}-newfile${req.body.ext}`), (err, fileData) => {
          fs.writeFile(path.join(UPLOAD_PATH, newPath), fileData, (err) => {
            if (err) {
              console.log('fileMove err:', err);
              return res.render('add_file', {
                flash: 'fileMove err:' + err,
                work,
              });
            } else {
              console.log('Added file at: ', newPath);
            }
          });
        });
        // construct the URI reference and add to the work's document
        const newId = work.uris.length;
        work.uris.push({
          id: newId,
          href: path.join(HOST, 'uploads', newPath),
          name: req.body.uriname,
          notes: req.body.urinotes,
        });
        const setObj = {
          uris: work.uris,
        };
        console.log('uripreview: ', req.body.uripreview);
        if (req.body.uripreview === 'on') setObj.preview = path.join(HOST, 'uploads', newPath);
        console.log('setObj:', setObj);
        Work.findByIdAndUpdate(req.params.id, {
          $set: setObj,
        }, {
          new: true
        }, (err, work) => {
          if (err) {
            console.log(err);
            return res.render('add_file', {
              flash: `error updating dB: ${err}`,
              work,
            });
          } else {
            console.log('added newfile uri:', work);
            req.session.flash =
              `Added file to ${work.title} at ${newPath}!`;
            return res.redirect(`/main`);
          }
        });
      });
  //   });
  // });
}

module.exports = {
  mainView, annotateProcessPost,
  editView, editProcessPost,
  delView, delProcessPost,
  addUriProcessPost, addFileProcessPost,
};
