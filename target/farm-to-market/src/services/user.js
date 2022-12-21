import http from "./http";

export const allUsers = () => {
  return http.get("/users/all");
};

export const updateProfile = (data) => {
  return http.patch("/users/update/profile", data);
};

export const updateAddress = (data, id) => {
  return http.patch("/address/update/address/" + id, data);
};

export const upload = (image) => {
  return http.post("/product/upload/", image);
};

export const allFarmerUsers = () => {
  return http.get("/users/farmers");
};

export const allSupplierUsers = () => {
  return http.get("/users/suppliers");
};

export const allAdminUsers = () => {
  return http.get("/users/admins");
};

export const activateDeactivateUser = (id) => {
  return http.patch(`/users/status/${id}`);
};

export const userDetails = (id) => {
  return http.get(`/users/detail/${id}`);
};

export const addressDetails = (id) => {
  return http.get(`/address/detail/${id}`);
};

export const approveUser = (id) => {
  return http.patch(`/users/approve/${id}`);
};

export const disapproveUser = (id) => {
  return http.patch(`/users/disapprove/${id}`);
};

export const allAccountUsers = () => {
  return http.get("/users/allaccounts");
};

export const generateOTP = (data) => {
  return http.post("/verify", data);
};

export const verifyOTP = (username) => {
  return http.get(`/verify/${username}`);
};

export const generateOTPEmail = (data) => {
  return http.post("/verify/email", data);
};

export const deleteOTP = (username) => {
  return http.delete(`/verify/delete/${username}`);
};

export const getAdmin = () => {
  return http.get("register/superadmindetail");
};

export const registerAdmin = () => {
  return http.post("register/superadmin");
};

export const getDetails = (id) => {
  return http.get("/users/detail/" + id);
};

export const addOffense = (data) => {
  return http.post("/user/offenses", data);
};

export const getOffense = (id) => {
  return http.get(`/user/offenses/${id}`);
};

export const updatePass = (data) => {
  return http.patch("/users/update/password", data);
};
