const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({ message: 'Handling GET reguests to /orders' });
});

router.post('/', (req, res, next) => {
  const order = {
    productId: req.body.productId,
    quantity: req.body.quantity,
  };
  res.status(201).json({
    message: 'Handling POST reguests to /orders',
    order,
  });
});

router.get('/:orderId', (req, res, next) => {
  res.status(200).json({ message: 'order id', id: req.params.orderId });
});

router.delete('/:orderId', (req, res, next) => {
  res.status(200).json({ message: 'order deleted' });
});

module.exports = router;
