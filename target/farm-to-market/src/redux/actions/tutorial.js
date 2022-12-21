import { toast } from "react-toastify";
import http from "../../services/http";
import { varibales } from "../constants/variables";

export const addTutorial =
  (data, type = "add") =>
  async (dispatch) => {
    await http.post("/tutorial/add", data).then((res) => {
      if (res.data && res.data.status === 1) {
        if (type !== "add") {
          toast.success("data has been modified");
        } else {
          toast.success(res.data.message);
        }

        dispatch({
          type: varibales.ADDTUTORIAL,
          payload: res.data,
        });
      } else {
        alert("An unexpected error occurred");
      }
    });
  };

export const addVideo = (image, video, data, type) => async (dispatch) => {
  if (image.entries().next().value[1] !== null) {
    await http.post("/tutorial/upload/", image).then((res) => {
      if (res.data && res.data.status === 1) {
      } else {
        alert("An unexpected error occurred");
      }
    });
  }
  if (video.entries().next().value[1] !== null) {
    await http.post("/tutorial/upload/", video).then((res) => {
      if (res.data && res.data.status === 1) {
        dispatch(addTutorial(data, type));
      } else {
        alert("An unexpected error occurred");
      }
    });
  }
};

export const addImage =
  (image, data, type = "add") =>
  async (dispatch) => {
    if (image.entries().next().value[1] !== null) {
      await http.post("/tutorial/upload/", image).then((res) => {
        if (res.data && res.data.status === 1) {
          dispatch(addTutorial(data, type));
        } else {
          alert("An unexpected error occurred");
        }
      });
    }
  };

export const addArticle =
  (image, article, data, type = "add") =>
  async (dispatch) => {
    if (image.entries().next().value[1] !== null) {
      await http.post("/tutorial/upload/", image).then((res) => {
        if (res.data && res.data.status === 1) {
        } else {
          alert("An unexpected error occurred");
        }
      });
    }

    if (article.entries().next().value[1] !== null) {
      await http.post("/tutorial/upload/", article).then((res) => {
        if (res.data && res.data.status === 1) {
          dispatch(addTutorial(data, type));
        } else {
          alert("An unexpected error occurred");
        }
      });
    }
  };
