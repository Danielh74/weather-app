import axios from "axios";

export const api = axios.create({
    baseURL: "http://api.weatherapi.com/v1/forecast.json?key=b1ec0c2815424ee1b86165244241502&q="
})