const User = require('../models/user');
const { badRequestError, notFoundError, internalError } = require('../constants');
// const { NotFoundError } = require('../errors/NotFoundError');
// const { InternalError } = require('../errors/InternalError');
// const { BadRequestError } = require('../errors/BadRequestError');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => { res.send({ data: user }); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequestError).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else { res.status(internalError).send({ message: 'Ошибка по умолчанию.' }); }
    });
};

module.exports.findAllUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => {
      res.status(internalError).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.findUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(notFoundError).send({ message: 'Пользователь по указанному _id не найден. ' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequestError).send({ message: 'Переданы некорректные данные при запросе.' });
      } else { res.status(internalError).send({ message: 'Ошибка по умолчанию.' }); }
    });
};

module.exports.updateProfile = (req, res) => {
  User.findByIdAndUpdate(

    req.user._id,
    { name: req.body.name, about: req.body.about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        res.status(notFoundError).send({ message: 'Пользователь по указанному _id не найден. ' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequestError).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else { res.status(internalError).send({ message: 'Ошибка по умолчанию.' }); }
    });
};

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        res.status(notFoundError).send({ message: 'Пользователь по указанному _id не найден. ' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequestError).send({ message: 'Переданы некорректные данные при обновлении аватара. ' });
      } else { res.status(internalError).send({ message: 'Ошибка по умолчанию.' }); }
    });
};
