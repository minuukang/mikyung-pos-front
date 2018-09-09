import axios from 'axios';

export default axios.create({
  baseURL: 'http://172.20.10.9:8080/api/v1/',
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
});
