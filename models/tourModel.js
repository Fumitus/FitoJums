const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const User = require('./userModel');

const toursShcema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must be less than least 40 character long'],
      minlength: [10, 'A tour name must be at least 10 characters long'],
      // validate: [
      //   validator.isAlpha,
      //   'A tour name must cointain ONLY characters.',
      // ],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty values can be aither: easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be higher or equal than 1'],
      max: [5, 'Rating must be lower or equal than 5'],
      set: (val) => Math.round(val * 10) / 10, // sita "makle" rasoma nes roud apvalina iki sveiku skaiciu
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          // this only point to the current document on NEW document creation
          return value < this.price;
        },
        message: 'Discount price must be lower the tour price.',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A Tour must have a cover image'],
    },
    images: [String],
    dAt: {
      type: Date,
      default: Date.now(),
      select: false, // niekad negrazins galutiniam vartotojui. Jautriai info paslepti
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON deklaruoti koordinates
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.Types.ObjectID, ref: 'User' }],
    ////=================================================================================
    ////Embed users to tour schema
    // guides: Array,
    ////=================================================================================
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// toursShcema.index({ price: 1 });
toursShcema.index({ price: 1, ratingsAverage: -1 });
toursShcema.index({ slug: 1 });
toursShcema.index({ startLocation: '2dshpere' });

//virtual properties naudojamas kai reikia grazinti vartototjui duomenis konvertuotus is dienu i savaites, ar km i mylias bet nenorime issaugoti siu duomenu kopiju duomenu bazeje.
//Sukuriams kaskart ir konvertuojama is default duomenu.
//Negalime panaudoti deliodami LINK'a. Negalime pateikti uzklausos surask objekta kurio trukme yra 1 savaite jeigu duomenu bazeje trukme yra saugoma dienomis.
toursShcema.virtual('durationWeeks').get(function () {
  return this.duration / 7; // naudojame this.duoration nes duomenis imame is konkretaus realiu laiku naudojamao dokumento
});

// Virtusl populate
toursShcema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

//Document midleware: runs before .save() and .() of document
toursShcema.pre('save', function (next) {
  // console.log(this);
  this.slug = slugify(this.name, { lower: true });
  next();
}); //veiksmas kuris bus atliekamas Pries tikra veiksma

////=================================================================================
////Embed users to tour schema

// toursShcema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });
////=================================================================================

// toursShcema.pre('save', function (next) {
//   console.log('Will save document...');
//   next();
// }); //preSaveHook or preSave Midleware

// //atliekama po pries tai buvusio veiksmo. siuo atveju po dokumento issaugojimo
// toursShcema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// Query MIDLLEWARE: runs before or after QUERY
//naudojama kai norime DB paslepti VIP pasiulymus, ar kita info kuri neturi butti siunciama kiekvienam
toursShcema.pre(/^find/, function (next) {
  //re naudojame kad butu vykdoma funcija su visais zodziais kurie prasideda next. nextOne, nextDelete
  // toursShcema.pre('find', function (next) {
  this.start = Date.now();
  this.find({ secretTour: { $ne: true } });

  next();
});

toursShcema.pre(/^find/, function (next) {
  this.populate({
    //// populate grazina info apie guides tik uzklausoje. i DB si info neirasoma
    path: 'guides',
    select: '-__v -passwordChangedAt', // isfiltruojame DB duomenis kuriu nenoriu matyt rezultatuose
  });
  next();
});

toursShcema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  // console.log(docs);
  next();
});

const Tour = mongoose.model('Tour', toursShcema);

module.exports = Tour;
