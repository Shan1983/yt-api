const express = require('express');

const router = express.Router();

// controllers
const UserController = require('../controllers/users');

// middlewarez
const CheckAuth = require('../middleware/check-auth');

router.post('/login', UserController.userLogin);

router.post('/signup', UserController.userSignup);

router.delete('/:userId', CheckAuth, UserController.userDelete);

module.exports = router;
