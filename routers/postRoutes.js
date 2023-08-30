const express = require('express');
const postController = require('../controllers/postController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router({ mergeParams: true });

// nested routes
//POST /tour/454h5g4jj4gj/review
//GET /tour/454h5g4jj4gj/review
//GET /tour/454h5g4jj4gj/review/435vh454543h

router
  .route('/')
  .get(postController.getAllPosts)
  .post(
    authController.protect,
    postController.setUserId,
    postController.createPost
  );

router
  .route('/:postId')
  .get(postController.getPost)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    postController.detelePost
  );

router.use('/:postId/', reviewRouter);

module.exports = router;
