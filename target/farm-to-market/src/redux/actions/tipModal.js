import { varibales } from "../constants/variables";

export const tipModal = (show) => {
  return function (dispatch) {
    dispatch({
      type: varibales.TIPMODAL,
      payload: show,
    });
  };
};
