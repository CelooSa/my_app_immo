import axios from "axios";

const strapiClient = axios.create({
    baseURL: 'http://localhost:1337/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000,

});


export default strapiClient;