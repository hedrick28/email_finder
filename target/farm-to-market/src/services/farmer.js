import http from "./http";

export const getCropById = (id) => {
  return http.get(`/crop/getCrop/${id}`);
};

export const editCrop = (id, crop) => {
  return http.patch(`/crop/editCrop/${id}`, crop);
};
