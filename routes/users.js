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
router.get('/:userId', findUserById);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).default('Исследователь'),
  }),
}), updateProfile);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(new RegExp('^(http|https):\/\/(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?')).default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
  }),
}), updateAvatar);

module.exports = router;
