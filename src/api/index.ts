import axios from 'axios';

export default axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
});
