const Post = require('../models/postModel');
const User = require('../models/userModel');

const catchAsync = require('../utils/cachAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.getOverview = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Post.find(), req.query).paginate().sort();
  const posts = await features.query;

  res.status(200).render('overview', {
    current_page: req.query.page,
    pages: posts.length,
    title: 'Visi įrašai',
    posts: posts,
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const post = await Post.findOne({ _id: req.params.postId })
    .populate({
      path: 'reviews',
      fields: 'review user',
    })
    .populate({
      path: 'postAuthor',
      fields: 'name',
    });

  if (!post) {
    return next(new AppError('There is no Post with that name', 404));
  }

  res.status(200).render('post', {
    title: `Vartotojo ${post.postAuthor[0].name} įrašas.`,
    post: post,
  });
});

exports.getMyPosts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Post.aggregate([
      {
        $match: {
          author_id: req.body.author_id,
        },
      },
      {
        $sort: { timeStamp: -1 },
      },
    ]),
    req.query
  )
    .paginate()
    .sort();
  const posts = await features.query;

  if (!posts) {
    return next(new AppError('You have no Posts', 404));
  }

  res.status(200).render('myposts', {
    current_page: req.query.page,
    pages: posts.length,
    title: `Vartotojo įrašai.`,
    posts,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});

exports.getPending = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Post.aggregate([
      {
        $match: {
          order_finished: false,
        },
      },
      {
        $sort: { timeStamp: -1 },
      },
    ]),
    req.query
  )
    .paginate()
    .sort();
  const posts = await features.query;

  if (!posts) {
    return next(new AppError('No pending orders', 404));
  }

  res.status(200).render('myposts', {
    current_page: req.query.page,
    pages: posts.length,
    title: `Nebaigti užsakymai.`,
    posts,
  });
});
