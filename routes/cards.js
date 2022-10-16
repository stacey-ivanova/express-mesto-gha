const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  createCard,
  findAllCards,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', findAllCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/),
  }),
}), createCard);
router.delete('/:cardId', celebrate({ query: Joi.object().keys({ _id: Joi.string().min(24).max(24) }) }), deleteCardById);
router.put('/:cardId/likes', celebrate({ query: Joi.object().keys({ _id: Joi.string().min(24).max(24) }) }), likeCard);
router.delete('/:cardId/likes', celebrate({ query: Joi.object().keys({ _id: Joi.string().min(24).max(24) }) }), dislikeCard);

module.exports = router;
