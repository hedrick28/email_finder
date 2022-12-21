import { combineReducers } from "redux";
import { auth } from "./auth";
import { product } from "./product";
import { tipModal } from "./tipModal";
import { complaintModal } from "./complaintModal";
import { message } from "./message";
import { calculator } from "./calculator";

export const allReducers = combineReducers({
  auth,
  product,
  tip: tipModal,
  complaint: complaintModal,
  message,
  calculator,
});
