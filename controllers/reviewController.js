const Review = require('../models/reviewModel');
// const catchAsync = require('../utils/cachAsync');
const factory = require('./handlerFactory');

exports.setUserPostIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.post) req.body.post = req.params.postId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
exports.getAllReviews = factory.getAllDocs(Review);
exports.getReview = factory.getOneDoc(Review);
exports.createReview = factory.createOneDoc(Review);
exports.updateReview = factory.updateOneDoc(Review);
exports.deleteReview = factory.deleteOneDoc(Review);
