import http from "./http";

export const rate = (data) => {
  return http.post("/rating/rate", data);
};

export const myRate = (product_id, user_id) => {
  return http.get(`/rating/myrate?product_id=${product_id}&user_id=${user_id}`);
};

export const allRating = (product_id) => {
  return http.get(`/rating/all/${product_id}`);
};

export const rateAds = (data) => {
  return http.post("/rating/ads/rate", data);
};

export const myRateAds = (advertisement_id, user_id) => {
  return http.get(
    `/rating/ads/myrate?product_id=${advertisement_id}&user_id=${user_id}`
  );
};

export const allRatingAds = (advertisement_id) => {
  return http.get(`/rating/ads/all/${advertisement_id}`);
};
