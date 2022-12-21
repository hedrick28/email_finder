import http from "./http";

export const productReport = (id) => {
  return http.get(`/report/orderreport/${id}`);
};

export const annualRevenueReport = (id) => {
  return http.get(`/report/annualreport/${id}`);
};
