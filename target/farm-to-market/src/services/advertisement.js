import http from "./http";
import { getUserInfo } from "./userInf";
const userInfo = getUserInfo();

export const addads = (data) => {
  return http.post("/advertisement/add", data);
};

export const adDetails = (id) => {
  return http.get(`/advertisement/advertisement/${id}`);
};

export const myAds = () => {
  return http.get(`/advertisement/myadvertisement/${userInfo.data.user_id}`);
};

export const adDelete = (id) => {
  return http.delete(`/advertisement/delete/${id}`);
};

export const otherAds = () => {
  return http.get(
    `/advertisement/other/advertisement/${userInfo.data.user_id}`
  );
};

export const getAllAd = () => {
  return http.get(`/advertisement/all`);
};
