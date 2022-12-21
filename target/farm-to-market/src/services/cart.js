import http from "./http";

export const addToCart = (data) => {
  return http.post("/cart/add", data);
};

export const deleteOrder = (id) => {
  return http.delete(`/cart/delete/${id}`);
};

export const getMyOrders = (id) => {
  return http.get(`/cart/myorders/${id}`);
};

export const orderQuantity = (type, id) => {
  return http.patch(`/cart/quantity?type=${type}&id=${id}`);
};

export const selectOrder = (id, type, allValue) => {
  return http.patch(`/cart/select/?id=${id}&type=${type}&value=${allValue}`);
};
