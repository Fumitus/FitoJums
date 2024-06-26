const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const slugify = require('slugify');
const validator = require('validator');
const User = require('./userModel');
const { kMaxLength } = require('buffer');

const postShcema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: [true, 'Įrašas turi turėti autorių.'],
      unique: false,
      trim: true,
      // validate: [
      //   validator.isAlpha,
      //   'A tour name must cointain ONLY characters.',
      // ],
    },

    timeStamp: {
      type: Date,
      default: Date.now(),
    },
    author_id: {
      type: mongoose.Schema.Types.String,
      ref: 'User',
      required: [true, 'Įrašas turi turėti autorių.'],
    },
    old_id: Number,
    client: {
      type: String,
      required: [true, 'Pridėkite recepto autorių'],
      unique: false,
      trim: true,
      default: 'Pacientas',
    },
    order_finished: {
      type: Boolean,
      default: false,
    },
    phones: {
      type: String,
      required: [true, 'Reikalingas mobilaus telefono numeris pristatymui.'],
      trim: true,
      minlength: [8, 'Telefono numeris turi būti 8 skaičių be šalies kodo!'],
      maxlength: [8, 'Telefono numeris turi būti max 8 skaičių'],
      validate: [
        validator.isNumeric,
        'Telefono numeris turi būti tik skaičiai be šalies kodo!',
      ],
    },
    delivery: {
      type: String,
      required: [true, 'Reikalingas adresas arba paštomatas pristatymui'],
    },

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

//virtual properties naudojamas kai reikia grazinti vartototjui duomenis konvertuotus is dienu i savaites, ar km i mylias bet nenorime issaugoti siu duomenu kopiju duomenu bazeje.
//Sukuriams kaskart ir konvertuojama is default duomenu.
//Negalime panaudoti deliodami LINK'a. Negalime pateikti uzklausos surask objekta kurio trukme yra 1 savaite jeigu duomenu bazeje trukme yra saugoma dienomis.

// Virtual populate
postShcema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'post',
  localField: '_id',
});

postShcema.virtual('postAuthor', {
  ref: 'User',
  foreignField: '_id',
  localField: 'author_id',
});

//Document midleware: runs before .save() and .() of documentconsole.log(post)
// this.slug = slugify(this.name, { lower: true });
// next();
// }); //veiksmas kuris bus atliekamas Pries tikra veiksma

////=================================================================================
////Embed users to tour schema

// postShcema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });
////=================================================================================

// postShcema.pre('save', function (next) {
//   console.log('Will save document...');
//   next();
// }); //preSaveHook or preSave Midleware

// //atliekama po pries tai buvusio veiksmo. siuo atveju po dokumento issaugojimo
// postShcema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// Query MIDLLEWARE: runs before or after QUERY
//naudojama kai norime DB paslepti VIP pasiulymus, ar kita info kuri neturi butti siunciama kiekvienam
postShcema.pre(/^find/, function (next) {
  //re naudojame kad butu vykdoma funcija su visais zodziais kurie prasideda next. nextOne, nextDelete
  // postShcema.pre('find', function (next) {
  this.start = Date.now();
  this.find({ secretTour: { $ne: true } });

  next();
});

postShcema.pre(/^find/, function (next) {
  this.populate({
    //// populate grazina info apie user tik uzklausoje. i DB si info neirasoma
    path: 'user',
    select: '-__v -passwordChangedAt', // isfiltruojame DB duomenis kuriu nenoriu matyt rezultatuose
  });
  next();
});

postShcema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  // console.log(docs);
  next();
});

postShcema.plugin(mongoosePaginate);

const Post = mongoose.model('Post', postShcema);

module.exports = Post;
