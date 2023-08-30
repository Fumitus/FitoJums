const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Post = require('../../models/postModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then(() => {
    console.log('DB connection succesfull!');
  });

// read JSON file
// const posts = JSON.parse(fs.readFileSync(`${__dirname}/final_posts.json`));
// const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/final_reviewa.json`));

//IMPORD DATA to DB

const importData = async () => {
  try {
    // await Post.create(posts);
    // await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data from file copied to DB succesfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//DELETE all data from DB

const deleteData = async () => {
  try {
    await Post.deleteMany();
    // await User.deleteMany();
    await Review.deleteMany();
    console.log('Data from  DB succesfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
