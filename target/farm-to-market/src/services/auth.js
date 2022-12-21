import http from "./http";

export const login = (data) => {
  return http.post("/login", data);
};

export const forgotpassword = (data) => {
  return http.post("/forgotpassword", data);
};
