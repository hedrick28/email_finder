import http from "./http";

export const allVideoTutorials = () => {
  return http.get("/tutorial/videos");
};

export const allImageTutorials = () => {
  return http.get("/tutorial/images");
};

export const allArticleTutorials = () => {
  return http.get("/tutorial/articles");
};

export const tutorialDetails = (id) => {
  return http.get(`/tutorial/detail/${id}`);
};

export const setVisibility = (id) => {
  return http.patch(`/tutorial/visibility/${id}`);
};

export const addComment = (data) => {
  return http.post("/tutorial/comment", data);
};

export const getComments = (id) => {
  return http.get(`/tutorial/comment/${id}`);
};

export const allTutorials = () => {
  return http.get("/tutorial/all");
};

export const rate = (data) => {
  return http.post("/tutorialrating/rate", data);
};

export const myRate = (tutorial_id, user_id) => {
  return http.get(
    `/tutorialrating/myrate?tutorial_id=${tutorial_id}&user_id=${user_id}`
  );
};

export const allRating = (tutorial_id) => {
  return http.get(`/tutorialrating/all/${tutorial_id}`);
};

export const addView = (data) => {
  return http.post("/tutorialviews/view", data);
};

export const allViews = (tutorial_id) => {
  return http.get(`/tutorialviews/all/${tutorial_id}`);
};

export const maxViewCount = (tutorial_id) => {
  return http.get(`/tutorialviews/max/${tutorial_id}`);
};

export const deleteComment = (id) => {
  return http.delete(`/tutorial/delete/${id}`);
};

export const editComment = (data) => {
  return http.patch("/tutorial/edit", data);
};
