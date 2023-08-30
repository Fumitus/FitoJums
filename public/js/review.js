import axios from 'axios';
import { showAlert } from './alerts';

export const newreview = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/reviews/',
      data: data,
    });
    if (res.data.status === 'success') location.reload(true);
    // {
    //   showAlert('success', 'Naujas kometaras sukurtas sėkmingai!');
    //   window.setTimeout(() => {
    //     location.assign(`/post/${res.data.body.post}`);
    //   }, 1500);
    // }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
