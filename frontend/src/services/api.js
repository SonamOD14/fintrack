import axios from "axios";

console.log("im here");
const ApiFromData = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "content-Type": "multipart/form-data"
  },
});

const Api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "content-Type": "application/json"
  },
});

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

// ===========auth=========
export const createUserApi = (data) => Api.post("/api/user/register", data);
export const loginUserApi = (data) => Api.post("/api/user/login", data);
export const forgetPasswordApi = (data) => Api.post("/api/user/forgetPassword", data);
export const resetPasswordApi = (data) => Api.post("/api/user/reset-password", data);


export const getallUsersApi = () => Api.get("/api/user/getalluser", config);
export const saveTransaction = (data) =>
  Api.post("/api/transaction/", data, getConfig());

export const getAllTransactions = () =>
  Api.get("/api/transaction/get-all", getConfig());

export const deleteTransaction = (id) =>
  Api.delete(`/api/transaction/${id}`, getConfig());

export const updateTransaction = (id, data) =>
  Api.put(`/api/transaction/${id}`, data, getConfig());
