const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

// connect to mongoose
mongoose.Promise = global.Promise;
mongoose.connect(
  `mongodb://Butterfly-wings-47:${
    process.env.MONGO_ATLAS_PASS
  }@node-rest-shop-shard-00-00-n4z84.mongodb.net:27017,node-rest-shop-shard-00-01-n4z84.mongodb.net:27017,node-rest-shop-shard-00-02-n4z84.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shop-shard-0&authSource=admin`,
  { useMongoClient: true },
);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use((req, res, next) => {
  const error = new Error('Not found!');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      code: error.status,
      message: error.message,
    },
  });
});

module.exports = app;
