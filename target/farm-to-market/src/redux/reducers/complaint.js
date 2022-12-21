import { varibales } from "../constants/variables";

export const complaint = (state = {}, action) => {
  switch (action.type) {
    case varibales.ADDCOMPLAINT:
      return action.payload;
    default:
      return state;
  }
};
