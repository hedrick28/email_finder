import http from "./http";

export const addToOrders = (data) => {
  return http.post("/order/add", data);
};

export const addBulkOrders = (data) => {
  return http.post("/order/addorders", data);
};

//find seller orders
export const getSellerOrders = (id) => {
  return http.get(`/order/sellerorders/${id}`);
};

//deliver order
export const deliverOrder = (id, type) => {
  return http.patch(`/order/deliver/?id=${id}&type=${type}`);
};

export const myPurchases = (id) => {
  return http.get(`/order/buyerorders/${id}`);
};

export const orderDetails = (id) => {
  return http.get(`/order/details/${id}`);
};
