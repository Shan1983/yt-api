const express = require('express');

const router = express.Router();

//middlewarez
const checkAuth = require('../middleware/check-auth');

// controllers
const OrdersController = require('../controllers/orders');

router.get('/', checkAuth, OrdersController.order_get_all);

router.post('/', checkAuth, OrdersController.orders_post);

router.get('/:orderId', checkAuth, OrdersController.get_by_id);

router.delete('/:orderId', checkAuth, OrdersController.order_delete);

module.exports = router;
