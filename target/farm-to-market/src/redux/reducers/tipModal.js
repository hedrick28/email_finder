import { varibales } from "../constants/variables";

export const tipModal = (state = {}, action) => {
  switch (action.type) {
    case varibales.TIPMODAL:
      return action.payload;
    default:
      return state;
  }
};
