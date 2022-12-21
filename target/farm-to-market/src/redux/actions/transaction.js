import { varibales } from "../constants/variables";

export const payWithGcash = (data) => {
  return function (dispatch) {
    dispatch({
      type: varibales.PAYWITHGCSH,
      payload: data,
    });
  };
};
