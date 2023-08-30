const express = require('express');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
// const viewController = require('../controllers/viewControler');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews) ///GET /post/454h5g4jj4gj/review
  .post(
    authController.restrictTo('user', 'admin'),
    reviewController.setUserPostIds, // Neveikia si eilute!!!!!
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(authController.restrictTo('admin'), reviewController.updateReview)
  .delete(authController.restrictTo('admin'), reviewController.deleteReview);

// router.get('/:id', (req, res, next) => {
//   console.log(req.params.postId);
//   next();
// });

module.exports = router;
