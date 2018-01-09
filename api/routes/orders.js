const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// model
const Order = require('../models/order');
const Product = require('../models/products');

router.get('/', (req, res, next) => {
  const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  Order.find()
    .select('quantity product _id')
    .populate('product', 'name')
    .exec()
    .then(doc => {
      console.log(doc);
      res.status(200).json({
        count: doc.length,
        status: 200,
        description: 'GET all orders',
        orders: doc.map(d => {
          return {
            _id: d._id,
            product: d.product,
            quantity: d.quantity,
            request: {
              type: 'GET',
              url: `${url}${d._id}`,
            },
          };
        }),
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

router.post('/', (req, res, next) => {
  const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  // check if the product exists..
  Product.findById(req.body.productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({
          status: 404,
          description: 'Product not found!',
        });
      }
      const newOrder = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      newOrder
        .save()
        .then(result => {
          console.log(result);
          res.status(201).json({
            status: 201,
            description: 'POST new order',
            order: {
              product: result.product,
              quantity: result.quantity,
              request: {
                type: 'GET',
                url: `${url}/${result._id}`,
              },
            },
          });
        })
        .catch(err => {
          res.status(500).json({
            error: {
              description: 'Product not found!',
              message: err.message,
            },
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

router.get('/:orderId', (req, res, next) => {
  const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

  Order.findById(req.params.orderId)
    .populate('product')
    .exec()
    .then(order => {
      if (!order) {
        return res.status(404).json({
          description: 'Order not found!',
        });
      }
      res.status(200).json({
        order,
        request: {
          type: 'GET',
          url,
        },
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

router.delete('/:orderId', (req, res, next) => {
  Order.remove({ _id: req.params.orderId })
    .exec()
    .then(result => {
      res.status(200).json({ description: 'Order deleted' });
    })
    .catch(err => {
      res.status(500).json({
        error: {
          message: err.message,
        },
      });
    });
});

module.exports = router;
