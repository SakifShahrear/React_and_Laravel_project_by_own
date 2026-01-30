import axios from 'axios';
window.axios = axios;

// Set base URL for API requests
window.axios.defaults.baseURL = 'http://localhost/KeepNote/public';

// Enable credentials (cookies) to be sent with requests
window.axios.defaults.withCredentials = true;

// Set default headers
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.headers.common['Accept'] = 'application/json';
