const router = require('express').Router();
const {
  createUser,
  findAllUsers,
  findUserById,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/', findAllUsers);
router.get('/:userId', findUserById);
router.post('/', createUser);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
