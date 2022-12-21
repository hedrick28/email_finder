import http from "./http";

export const comment = async (data) => {
  return await http.post("/productcomment/comment", data);
};

export const getProductComment = (id) => {
  return http.get(`/productcomment/getcomment/${id}`);
};

export const deleteComment = (id) => {
  return http.delete(`/productcomment/delete/${id}`);
};

export const editComment = (data) => {
  return http.patch("/productcomment/edit", data);
};
