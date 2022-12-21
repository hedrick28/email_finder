import { toast } from "react-toastify";
import http from "../../services/http";

export const addTip = (data) => async (dispath) => {
  await http.post("/tip/add", data).then((res) => {
    if (res.data && res.data.status === 1) {
      toast.success(res.data.message);
    } else if (res.data && res.data.status === 0) {
      toast.error(res.data.message);
    }
  });
};

export const deleteTip = (id, type) => async (dispath) => {
  await http.delete(`/tip/delete?tip_id=${id}&type=${type}`).then((res) => {
    if (res.data && res.data.status === 1) {
      toast.success(res.data.message);
    } else if (res.data && res.data.status === 0) {
      toast.error(res.data.message);
    }
  });
};
