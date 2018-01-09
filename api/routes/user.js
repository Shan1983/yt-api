const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

// models
const User = require('../models/user');

router.post('/login', (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: 'Unauthorized',
        });
      }

      // check passwords
      bcrypt.compare(req.body.password, user[0].password, (err, resp) => {
        if (err) {
          return res.status(401).json({
            message: 'Unauthorized',
          });
        }
        if (resp) {
          jwt.sign({
            email: user[0].email,
            userId: user[0]._id,
          });
          return res.status(200).json({
            message: 'success',
          });
        }
        return res.status(401).json({
          message: 'Unauthorized',
        });
      });
    })
    .catch(err => {
      res.status(500).json({
        error: {
          message: err.message,
        },
      });
    });
});

router.post('/signup', (req, res, next) => {
  // lets find the email..
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          error: {
            description: 'Email Exists',
            message: 'No user added!',
          },
        });
      } else {
        // hash the password straight up..
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            res.status(500).json({
              error: {
                message: err.message,
              },
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  response: 'User created',
                });
              })
              .catch(error => {
                res.status(500).json({
                  error: {
                    message: error.message,
                  },
                });
              });
          }
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: {
          message: err.message,
        },
      });
    });
});

router.delete('/:userId', (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        description: 'User removed!',
      });
    })
    .catch(error => {
      res.status(500).json({
        error: {
          message: error.message,
        },
      });
    });
});

module.exports = router;
