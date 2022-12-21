import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ComplaintForm from "../../components/complaint/ComplaintForm";
import { add } from "../../redux/actions/complaint";
import { useDispatch } from "react-redux";
import { myComplaints } from "../../services/complaints";

const AddComplaint = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);

  const handleSubmit = (image, data) => {
    dispatch(add(image, data)).then((response) =>
      myComplaints().then((res) => {
        setComplaints(res.data);
        navigate("/complaint/mycomplaints");
      })
    );
  };

  return (
    <div>
      <ComplaintForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddComplaint;
