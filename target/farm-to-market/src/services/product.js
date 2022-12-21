import http from "./http";
import { getUserInfo } from "./userInf";
const userInfo = getUserInfo();

export const myProducts = () => {
  return http.get(`/product/myproduct/${userInfo.data.user_id}`);
};

export const findOwnerProduct = (id) => {
  return http.get(`/product/myproduct/${id}`);
};

export const productDetails = (id) => {
  return http.get(`/product/product/${id}`);
};

export const productDelete = (id) => {
  return http.delete(`/product/delete/${id}`);
};

export const allProducts = () => {
  return http.get(`product/all/`);
};

export const searchProduct = (key) => {
  return http.get(`/product/search/${key}`);
};

export const categories = (type) => {
  return http.get(`/product/category/${type}`);
};
