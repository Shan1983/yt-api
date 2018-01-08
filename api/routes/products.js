const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({ message: 'Handleing GET reguests to /products' });
});

router.post('/', (req, res, next) => {
  const product = {
    name: req.body.name,
    price: req.body.price,
  };
  res.status(201).json({
    message: 'Handleing POST reguests to /products',
    createdProduct: product,
  });
});

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;
  if (id === 'special') {
    res
      .status(200)
      .json({ message: `your product id of ${id} is pretty special` });
  }
  res.status(200).json({ message: `your product id is ${id}` });
});

router.patch('/:productId', (req, res, next) => {
  res.status(200).json({ message: 'product updated!' });
});

router.delete('/:productId', (req, res, next) => {
  res.status(200).json({ message: 'product deleted!' });
});

module.exports = router;
