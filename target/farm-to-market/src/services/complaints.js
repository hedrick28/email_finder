import http from "./http";
import { getUserInfo } from "./userInf";

export const myComplaints = () => {
  const userInfo = getUserInfo();
  return http.get(`/complaint/mycomplaints/${userInfo.data.user_id}`);
};

export const complaintDetails = (id) => {
  return http.get(`/complaint/mycomplaints/detail/${id}`);
};

export const complaintDelete = (id) => {
  return http.delete(`/complaint/mycomplaints/delete/${id}`);
};

export const complaintCancel = (id) => {
  return http.patch(`/complaint/mycomplaints/cancel/${id}`);
};

export const allComplaints = () => {
  return http.get("complaint/all");
};

export const complaintReview = (id) => {
  return http.patch(`/complaint/review/${id}`);
};

export const complaintApprove = (id, user_id) => {
  return http.patch(`/complaint/approve/${id}/${user_id}`);
};

export const complaintDisapprove = (id) => {
  return http.patch(`/complaint/disapprove/${id}`);
};

export const complaintsAboutMe = () => {
  const userInfo = getUserInfo();
  return http.get(`/complaint/complaintsaboutme/${userInfo.data.businessName}`);
};

export const getNotifComplaint = () => {
  const userInfo = getUserInfo();
  return http.get(`/complaint/notif/${userInfo.data.businessName}`);
};

export const seenNotifComplaint = (id) => {
  return http.patch(`/complaint/seen/${id}`);
};
