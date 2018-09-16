import axios from 'axios';

export default axios.create({
  baseURL: 'http://192.168.2.6:8080/api/v1/',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
});
