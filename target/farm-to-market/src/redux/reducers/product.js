import { varibales } from "../constants/variables";

export const product = (state = {}, action) => {
  switch (action.type) {
    case varibales.ADDPRODUCT:
      return action.payload;
    default:
      return state;
  }
};
