import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:8000/api",
});

instance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("token");
        console.log(token);
        console.log("config", config);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {

        return Promise.reject(error);
    }
);

export default instance;