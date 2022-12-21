import { varibales } from "../constants/variables";

export const calculator = (state = false, action) => {
  switch (action.type) {
    case varibales.CALCULATOR:
      return action.payload;
    default:
      return state;
  }
};
