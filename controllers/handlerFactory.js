const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/cachAsync');
const AppError = require('../utils/appError');

exports.deleteOneDoc = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id, {
      useFindAndModify: false,
    });

    if (!doc) {
      return next(new AppError('No document with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOneDoc = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.postId, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    if (!doc) {
      return next(new AppError('No document with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.createOneDoc = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: newDoc,
      },
    });
  });

exports.getOneDoc = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.postId);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No docuemnt found with that ID', 404));
    }

    //Tour.findOne({ _id: req.params.id })
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getAllDocs = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow nested GET reviews for tour. <<<HACK>>>
    let filter = {};
    if (req.body.author_id) filter = { author_id: req.body.author_id };

    // EXECUTE A QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // const doc = await features.query.explain();
    const doc = await features.query;
    // query.sort().select().skip().limit()

    //SEND RESPONSE

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
