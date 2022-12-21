import http from "./http";
import { getUserInfo } from "./userInf";

const userInfo = getUserInfo();

export const getOwnerTips = () => {
  return http.get(`tip/mytips/${userInfo.data.user_id}`);
};

export const tipDetails = (id) => {
  return http.get(`tip/details/${id}`);
};

export const addTipService = (data) => {
  return http.post("/tip/add", data);
};
