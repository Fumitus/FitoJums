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
