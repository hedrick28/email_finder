import { varibales } from "../constants/variables";

export const message = (state = {}, action) => {
  switch (action.type) {
    case varibales.PERSONMESSAGE:
      return action.payload;
    default:
      return state;
  }
};
