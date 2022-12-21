import http from "./http";

export const comment = async (data) => {
  return await http.post("/adscomment/comment", data);
};

export const getAdsComment = (id) => {
  return http.get(`/adscomment/getcomment/${id}`);
};

export const deleteComment = (id) => {
  return http.delete(`/adscomment/delete/${id}`);
};

export const editComment = (data) => {
  return http.patch("/adscomment/edit", data);
};
