import axios, { type AxiosInstance } from "axios";
const baseURL = "https://image-loading-sit.popclub.co.in"; 
//import.meta.env.VITE_BASE_API;

const apiClient: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Authorization": "Token msjhypajt_3jc7egbbfc09fveb3fd4dead1238b0qweaa8447asdcbasdf48eaqaw"
  },
  validateStatus: () => true,
});

export default apiClient;