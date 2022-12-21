import { toast } from "react-toastify";
import http from "../../services/http";

export const login = (data) => {
  return async function () {
    await http.post("/login", data).then((res) => {
      if (res.data && res.data.status === 1) {
        toast.success(res.data.message);
      } else if (res.data && res.data.status === 0) {
        toast.error(res.data.message);
      }
    });
  };
};

export const register = (data) => {
  return async function () {
    await http.post("/register", data).then((res) => {
      if (res.data && res.data.status === 1) {
        toast.success(res.data.message);
      } else if (res.data && res.data.status === 0) {
        toast.error(res.data.message);
      }
    });
  };
};

export const add = (image, imageSupplier, data) => async (dispatch) => {
  if (data.role === "farmer") {
    if (image.entries().next().value[1] !== null) {
      await http.post("/register/upload/", image).then((res) => {
        if (res.data && res.data.status === 1) {
          dispatch(register(data));
        } else {
          alert("An unexpected error occurred");
        }
      });
    }
  } else {
    if (image.entries().next().value[1] !== null) {
      await http.post("/register/upload/", image);
    }
    if (imageSupplier.entries().next().value[1] !== null) {
      await http.post("/register/upload/", imageSupplier).then((res) => {
        if (res.data && res.data.status === 1) {
          dispatch(register(data));
        } else {
          alert("An unexpected error occurred");
        }
      });
    }
  }
};
