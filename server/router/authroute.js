const express = require('express');
const { signup,signin,google,signout } = require('../controllers/authcontrol');

const routes = express.Router()



routes.post('/signup', signup)
routes.post('/signin', signin)
routes.post('/google', google)
routes.get('/signout', signout)


module.exports = routes;