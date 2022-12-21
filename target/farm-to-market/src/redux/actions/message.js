import http from "../../services/http";
import { varibales } from "../constants/variables";

export const getPersonMessage = (sender, receiver, details) => {
  return async function (dispatch) {
    await http
      .get(`/message/personmessage?sender=${sender}&receiver=${receiver}`)
      .then((res) => {
        if (res.data) {
          dispatch({
            type: varibales.PERSONMESSAGE,
            payload: {
              show: true,
              data: res.data,
              receiver,
              receiverDetails: details,
            },
          });
        }
      });
  };
};
