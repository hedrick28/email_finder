import http from "./http";

export const getNotif = (id) => {
  return http.get(`/tip/notif/${id}`);
};

export const seenTip = (id) => {
  return http.patch(`/tip/seen/${id}`);
};

export const seenNotifComplaint = (id) => {
  return http.patch(`/complaint/seen/${id}`);
};

export const seenAds = (id) => {
  return http.patch(`/advertisement/seen/${id}`);
};
