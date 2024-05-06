const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    trim: true,
    maxlength: [40, 'A username must have 40 or less characters'],
  },
  email: {
    type: String,
    unique: [true, 'Email must be unique'],
    lowercase: true,
    validate: [validator.isEmail, 'Please supply a valid email'],
  },
  company: {
    type: String,
    trim: true,
    maxlength: [40, 'Įmonės pavadinimas turi būti ne ilgesnis nei 40 simbolių'],
  },
  userPhone: {
    type: String,
    trim: true,
    minlength: [8, 'Telefono numeris turi būti 8 skaičių be šalies kodo!'],
    maxlength: [8, 'Telefono numeris turi būti max 8 skaičių'],
    validate: [
      validator.isNumeric,
      'Telefono numeris turi būti tik skaičiai be šalies kodo!',
    ],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Password is mandatory'],
    minlength: [8, 'Password must contain atleast 8 simbols'],
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      //Veikia tik su SAVE arba .create Reikia tai tureti omenyje kai reikia atnaujinti slaptazodi.
      //Atnaujinant slaptazodi reikia ji sukurti is naujo
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords do not match!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  //Only run function is 'password' is modified
  if (!this.isModified('password')) return next();

  //hash the password with cost 12
  this.password = await bcrypt.hash(this.password, 12);

  /// Delete the passwordConfirm after password hash was saved
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000; // -1000 ms reikalaingas todel kad kartais DB padaro irasa veliau nei JWT token yra sukuriamas. Maza gudrybe.
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.passwordChangedAfter = function (JwtTimeStamp) {
  if (this.passwordChangedAt) {
    // console.log('------------------------------------------');
    // console.log(changedTimeStamp, JwtTimeStamp);
    // console.log(JwtTimeStamp < changedTimeStamp);
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JwtTimeStamp < changedTimeStamp; // tikriname ar slaptazodis buvo keistas po to kai buvo sugeneruotas JWT token
  }

  // False means password was not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
