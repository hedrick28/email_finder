import { varibales } from "../constants/variables";

export const auth = (state = {}, action) => {
  switch (action.type) {
    case varibales.LOGIN:
      return action.payload;
    case varibales.REGISTER:
      return action.payload;
    default:
      return state;
  }
};
