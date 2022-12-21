import { toast } from "react-toastify";
import http from "../../services/http";
import { varibales } from "../constants/variables";

export const addAdvertisement =
  (data, type = "add") =>
  async (dispatch) => {
    await http.post("/advertisement/add", data).then((res) => {
      if (res.data && res.data.status === 1) {
        if (type !== "add") {
          toast.success("data has been modified");
        } else {
          toast.success(res.data.message);
        }

        dispatch({
          type: varibales.ADDADVERTISEMENT,
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
      await http.post("/advertisement/upload/", image).then((res) => {
        if (res.data && res.data.status === 1) {
          dispatch(addAdvertisement(data, type));
        } else {
          alert("An unexpected error occurred");
        }
      });
    }
  };
