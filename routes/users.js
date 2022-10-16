const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  findAllUsers,
  findUserById,
  updateProfile,
  updateAvatar,
  getProfile,
} = require('../controllers/users');

router.get('/', findAllUsers);
router.get('/me', getProfile);
router.get('/:userId', celebrate({ params: Joi.object().keys({ userId: Joi.string().min(24).max(24) }) }), findUserById);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).default('Исследователь'),
  }),
}), updateProfile);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/).default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
  }),
}), updateAvatar);

module.exports = router;
