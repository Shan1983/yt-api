const express = require('express');

const multer = require('multer');

const router = express.Router();

// middlewarez
const checkAuth = require('../middleware/check-auth');

// config multer
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${new Date().toISOString()}${file.originalname}`);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  }
  cb(null, false);
};
const upload = multer({
  storage,
  limit: { fileSize: 1024 * 1024 * 5 },
  fileFilter,
}); //5megs

// controller
const ProductController = require('../controllers/products');

router.get('/', ProductController.getAll);

router.post(
  '/',
  checkAuth,
  upload.single('productImage'),
  ProductController.postNew,
);

router.get('/:productId', ProductController.getById);

router.patch('/:productId', checkAuth, ProductController.updateProduct);

router.delete('/:productId', checkAuth, ProductController.deleteProduct);

module.exports = router;
