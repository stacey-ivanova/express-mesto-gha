const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { NotFoundError } = require('./errors/NotFoundError');
const { InternalError } = require('./errors/InternalError');
const { ValidateError } = require('./errors/ValidateError');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const { PORT = 3000 } = process.env;

app.post('/signin', login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).default('Исследователь'),
    avatar: Joi.string().regex(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/).default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
    email: Joi.string().required().email(),
    password: Joi.string().min(4).alphanum().required(),
  }),
}), createUser);
app.use('/users', auth, routerUser);
app.use('/cards', auth, routerCard);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});
app.use(errors());

// eslint-disable-next-line consistent-return
// app.use((err, req, res, next) => {
//   if (err.status) {
//     return res.status(err.status).send({ message: err.message });
//   }
//   const error = new InternalError('Произошла ошибка на сервере1');
//   res.status(error.status).send({ message: error.message });
//   next();
// });

app.use((err, req, res, next) => {
  // const { statusCode = 500, message } = err;
  res.status(err.statusCode).send({message: err.message});
});

app.listen(PORT);

// message: statusCode === 500
// ? 'На сервере произошла ошибка'
// : message,
// });
// next();