import { varibales } from "../constants/variables";

export const complaintModal = (state = {}, action) => {
  switch (action.type) {
    case varibales.COMPLAINTMODAL:
      return action.payload;
    default:
      return state;
  }
};
