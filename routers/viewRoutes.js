const express = require('express');

const viewController = require('../controllers/viewControler');
const postController = require('../controllers/postController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewController.getOverview);

router.get('/post/:postId', authController.isLoggedIn, viewController.getPost);

router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/me', authController.protect, viewController.getAccount);
router.get(
  '/my-posts',
  authController.protect,
  postController.setUserId,
  viewController.getMyPosts
);

router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData
);

module.exports = router;
