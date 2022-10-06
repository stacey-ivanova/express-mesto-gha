const User = require('../models/user');
// const { NotFoundError } = require('../errors/NotFoundError');
// const { InternalError } = require('../errors/InternalError');
// const { BadRequestError } = require('../errors/BadRequestError');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => { res.send({ data: user }); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.findAllUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

module.exports.findUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: err.message });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.updateProfile = (req, res) => {
  User.findByIdAndUpdate(

    req.user._id,
    { name: req.body.name, about: req.body.about },
    {
      new: true,
      runValidators: true,
      upsert: true,
    }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === ' ValidationError') {
        res.status(400).send({ message: err.message });
      } else if (err.name === 'CastError') {
        res.status(404).send({ message: err.message });
      }

      res.status(500).send({ message: err.message });
    });
};

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === ' ValidationError') {
        res.status(400).send({ message: err.message });
      } else if (err.name === 'CastError') {
        res.status(404).send({ message: err.message });
      }
      res.status(500).send({ message: err.message });
    });
};
