import { toast } from "react-toastify";
import http from "../../services/http";
import { varibales } from "../constants/variables";

export const addComplaint =
  (data, type = "add") =>
  async (dispatch) => {
    await http.post("/complaint/add", data).then((res) => {
      if (res.data && res.data.status === 1) {
        if (type !== "add") {
          toast.success("Data has been modified");
        } else {
          toast.success(res.data.message);
        }
        dispatch({
          type: varibales.ADDCOMPLAINT,
          payload: res.data,
        });
      } else {
        alert("An unexpected error occurred");
      }
    });
  };

export const add =
  (image, data, type = "add") =>
  async (dispatch) => {
    if (image.entries().next().value[1] !== null) {
      await http.post("/complaint/upload/", image).then((res) => {
        if (res.data && res.data.status === 1) {
          dispatch(addComplaint(data, type));
        } else {
          alert("An unexpected error occurred");
        }
      });
    }
  };

export const complaintModal = (show) => {
  return function (dispatch) {
    dispatch({
      type: varibales.COMPLAINTMODAL,
      payload: show,
    });
  };
};
