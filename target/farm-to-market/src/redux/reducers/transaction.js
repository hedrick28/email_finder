import { varibales } from "../constants/variables";

export const gcash = (state = {}, action) => {
  switch (action.type) {
    case varibales.PAYWITHGCSH:
      return action.payload;
    default:
      return state;
  }
};
