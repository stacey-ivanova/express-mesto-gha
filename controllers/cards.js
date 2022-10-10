const Card = require('../models/card');
const { badRequestError, notFoundError, internalError } = require('../constants');
// const { NotFoundError } = require('../errors/NotFoundError');
// const { InternalError } = require('../errors/InternalError');
// const { BadRequestError } = require('../errors/BadRequestError');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  // eslint-disable-next-line no-underscore-dangle
  const userId = req.user._id;

  Card.create({ name, link, owner: userId })
    .then((card) => res.send({ data: card }))
    .catch(
      (err) => {
        if (err.name === 'ValidationError') {
          res.status(badRequestError).send({ message: ' Переданы некорректные данные при создании карточки' });
        } else res.status(internalError).send({ message: 'Ошибка по умолчанию.' });
      },
    );
};

module.exports.findAllCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() => {
      res.status(internalError).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(notFoundError).send({ message: 'Карточка с указанным _id не найдена.' });
        return;
      }
      res.send({ data: card })})
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequestError).send({ message: 'Переданы некорректные данные для удаления карточки' });
} else { res.status(internalError).send({ message: 'Ошибка по умолчанию.' }); }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(notFoundError).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      res.send({ data: card })})
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequestError).send({ message: 'Переданы некорректные данные для постановки лайка. ' });
      } else if (err.name === 'CastError') {
        res.status(badRequestError).send({ message: 'Переданы некорректные данные карточки.' });
      } else res.status(internalError).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(notFoundError).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequestError).send({ message: 'Переданы некорректные данные для снятия лайка. ' });
      } else if (err.name === 'CastError') {
        res.status(badRequestError).send({ message: 'Переданы некорректные данные карточки.' });
      } else res.status(internalError).send({ message: 'Ошибка по умолчанию.' });
    });
};
