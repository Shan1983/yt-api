const mongoose = require('mongoose');

// models
const Product = require('../models/products');

exports.getAll = (req, res, next) => {
  Product.find()
    .select('name price _id productImage')
    .exec()
    .then(doc => {
      const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      const response = {
        count: doc.length,
        product: doc.map(doc => {
          return {
            status: 200,
            description: 'Get ALL products',
            name: doc.name,
            price: doc.price,
            productImage: doc.productImage,
            _id: doc._id,
            request: {
              type: 'GET',
              url: `${url}/${doc._id}`,
            },
          };
        }),
      };
      //   if (doc.length > 0) {
      res.status(200).json(response);
      //   } else {
      //     res.status(404).json({ message: 'Not found' });
      //   }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.postNew = (req, res, next) => {
  const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  console.log(req.file);
  // save a new product
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });

  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        newProduct: {
          status: 201,
          description: 'POST new product',
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: 'GET',
            url: `${url}/${result._id}`,
          },
        },
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.getById = (req, res, next) => {
  const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  const id = req.params.productId;
  Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
      console.log(doc);
      if (doc) {
        res.status(200).json({
          status: 200,
          description: 'Get SINGLE product',
          name: doc.name,
          price: doc.price,
          request: {
            type: 'GET',
            url: `${url}`,
          },
        });
      } else {
        res.status(404).json({ message: 'Not found!' });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.updateProduct = (req, res, next) => {
  const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  const id = req.params.productId;
  const updateOps = {};

  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  Product.update(
    { _id: id },
    {
      $set: updateOps,
    },
  )
    .exec()
    .then(result => {
      res.status(200).json({
        status: 200,
        description: 'UPDATE product',
        request: {
          type: 'GET',
          url: `${url}`,
        },
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.deleteProduct = (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: `Product ${id} has been deleted`,
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};
