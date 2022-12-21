import React from "react";
import { toast } from "react-toastify";
import TipForm from "../../components/admin/TipForm";
import { addTipService } from "../../services/tips";

const AddTip = () => {
  const handleSubmit = (data) => {
    addTipService(data).then((res) => {
      if (res.data && res.data.status === 1) {
        toast.success(res.data.message);
      } else if (res.data && res.data.status === 0) {
        toast.error(res.data.message);
      }
    });
  };
  return (
    <div className="container mb-4 mt-4 ">
      <div className="d-flex justify-content-center">
        <TipForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default AddTip;
