import http from "./http";

export const getNames = () => {
  return http.get("/message/names");
};

export const sendMessage = (data) => {
  return http.post("/message/send", data);
};

export const myMessages = (id) => {
  return http.get(`/message/mymessages/${id}`);
};
