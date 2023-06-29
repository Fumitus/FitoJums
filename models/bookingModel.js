const mongoose = require('mongoose');

const bookingsSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.Types.ObjectID,
    ref: 'Tour',
    required: [true, 'Bookings must belong to a Tour'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectID,
    ref: 'User',
    required: [true, 'Bookings must belong to a User'],
  },
  price: {
    type: Number,
    required: [true, 'Booking must have a price!'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

bookingsSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'tour',
    select: 'name',
  });
  next();
});

const Booking = mongoose.model('Booking', bookingsSchema);
module.exports = Booking;
