import http from "./http";

export const transac = (data, code) => {
  return http.post(`/transaction/add/${code}`, data);
};

export const getTransaction = (code) => {
  return http.get(`/transaction/transaction/${code}`);
};

export const paynow = (data) => {
  return http.post("/transaction/paynow", data);
};

export const paynowCODandPickup = (data) => {
  return http.post("/transaction/paynow1", data);
};

export const transactionStatus = (code) => {
  return http.get(`/transaction/status/${code}`);
};

export const gcashPaymentTransaction = () => {
  return http.post(`/transaction/gcash`);
};

export const payWithGcash = (data) => {
  return http.post(`/transaction/paywithgcash`, data);
};
