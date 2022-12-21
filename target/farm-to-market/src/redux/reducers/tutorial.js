import { varibales } from "../constants/variables";

export const tutorial = (state = {}, action) => {
  switch (action.type) {
    case varibales.ADDTUTORIAL:
      return action.payload;
    default:
      return state;
  }
};
