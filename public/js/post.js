/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

export const newpost = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/posts',
      data: data,
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Naujas įrašas sukurtas sėkmingai!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const finishorder = async (data) => {
  try {
    const url = `/api/v1/posts/${data.postId}`;
    const res = await axios({
      method: 'PATCH',
      url: url,
      data: data,
    });
    console.log(res.data);
    if (res.data.status === 'success') {
      showAlert('success', 'Užsakymas užbaigtas sėkmingai!');
      window.setTimeout(() => {
        location.assign('/pendingOrders/?page=1');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
