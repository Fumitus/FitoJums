const multer = require('multer');
const sharp = require('sharp');
const Post = require('../models/postModel');
const catchAsync = require('../utils/cachAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images!', 400), false);
  }
};

exports.setUserId = (req, res, next) => {
  if (!req.body.author_id) req.body.author_id = req.user.id;
  next();
};

// upload.single('image') is on req.file
// upload.array('images', 5) is on req.files

//// Naudojau faila su duomenimis kol nebuvo paruosta DB
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

/// Midleware kuria naudojau kai reikejo patikrinti israso ID dublikata JSON faile

// exports.checkID = (req, res, next, val) => {
//   console.log(`Tour id is: ${val}`);

//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'missing name or price',
//     });
//   }
//   next();
// };

exports.getAllPosts = factory.getAllDocs(Post);

// exports.getPost = factory.getOneDoc(Post, { path: 'reviews' });
exports.getPost = factory.getOneDoc(Post);

exports.createPost = factory.createOneDoc(Post);

exports.updatePost = factory.updateOneDoc(Post);
//Si eilute pakeicia visa koda kuris buvo skirtas deleteTour. Taip factory leidziai pakartotinai panaudoti koda.
exports.detelePost = factory.deleteOneDoc(Post);
// exports.deteleTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);

//   if (!tour) {
//     return next(new AppError('No tour with that ID', 404));
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });
