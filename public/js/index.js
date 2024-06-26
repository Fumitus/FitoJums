/* eslint-disable */
import 'regenerator-runtime/runtime.js';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { showAlert } from './alerts';
import { finishorder, newpost } from './post';
import { newreview } from './review';

// DOM elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const postForm = document.querySelector('.form-post-data');
const reviewForm = document.querySelector('.form-review-data');
const deliveryForm = document.querySelector('.form-delivery-data');

if (reviewForm) {
  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const post = document.getElementById('postId').value;
    const review = document.getElementById('review').value;

    newreview({ review, post }, 'data');
  });
}

if (postForm) {
  postForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const body = document.getElementById('body').value;
    const phones = document.getElementById('phones').value;
    const delivery = document.getElementById('delivery').value;
    const client = document.getElementById('client').value;

    newpost({ body, client, phones, delivery }, 'data');
  });
}

if (deliveryForm) {
  deliveryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const postId = document.getElementById('postId').value;
    const order_finished = document.getElementById('order_finished').value;

    finishorder({ postId, order_finished }, 'data');
  });
}

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    // VALUES
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}
if (logOutBtn) logOutBtn.addEventListener('click', logout);

// if (userUserDataForm) {
//   userUserDataForm.addEventListener('submit', (e) => {
//     e.preventDefault();
//     const email = document.getElementById('email').value;
//     const name = document.getElementById('name').value;

//     updateSettings({ name, email }, 'data');
//   });
// }

if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('userPhone', document.getElementById('userPhone').value);
    form.append('company', document.getElementById('company').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );
    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

const alertMessage = document.querySelector('body').dataset.alert;
if (alert) showAlert('success', alertMessage, 20);
