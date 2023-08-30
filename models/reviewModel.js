const mongoose = require('mongoose');
const { findByIdAndUpdate, findByIdAndDelete } = require('./postModel');
const Post = require('./postModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty!'],
      trim: true,
      maxlength: [100, 'A review must be less than least 100 character long'],
    },
    review_html: {
      type: String,
      trim: true,
      maxlength: [100, 'A review must be less than least 100 character long'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Review must have a reference post.'],
    },
    disabled: Boolean,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a User.'],
    },
    author_id: Number,
    post_id: Number,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ post: 1, user: 1 }, { unique: false });

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   //// populate grazina info apie guides tik uzklausoje. i DB si info neirasoma
  //   path: 'tour',
  //   select: 'name',
  // }).populate({
  //   path: 'user',
  //   select: 'name photo',
  // });
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  console.log(this.r);
});

// reviewSchema.post(/^findOneAnd/, async function () {
//   // await this.findOne(); Does NOT work here because query has already executed
//   await this.r.constructor.calcAverageRatings(this.r.tour);
// });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
/// review /rating /created at / ref to tour / ref to user
